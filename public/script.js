document.addEventListener('DOMContentLoaded', init);

let currentEdit = null; // נשמור כאן את האתר בעריכה

async function init() {
  bindEditForm();
  await loadSites();
}

async function loadSites() {
  const statusEl = get('#status');
  const tableEl  = get('#sitesTable');
  const tbodyEl  = get('#sitesTbody');

  statusEl.hidden = false;
  statusEl.textContent = 'טוען…';
  tableEl.hidden = true;

  try {
    const res = await fetch('/sites');
    if (!res.ok) throw new Error('שגיאה בשרת');
    const sites = await res.json();

    if (!Array.isArray(sites) || sites.length === 0) {
      statusEl.textContent = 'אין נתונים להצגה.';
      return;
    }

    renderTable(sites, tbodyEl);
    statusEl.hidden = true;
    tableEl.hidden = false;
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'נכשלה טעינת הנתונים.';
  }
}

function renderTable(sites, tbody) {
  tbody.innerHTML = '';
  sites.forEach(site => {
    const tr = document.createElement('tr');

    // תמונה
    const tdImg = document.createElement('td');
    const img = document.createElement('img');
    img.className = 'site-img';
    img.src = site.image || '';
    img.alt = site.name || 'site image';
    img.referrerPolicy = 'no-referrer';
    img.onerror = () => { img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='; };
    tdImg.appendChild(img);

    // שם
    const tdName = document.createElement('td');
    tdName.textContent = site.name || '';

    // קישור
    const tdUrl = document.createElement('td');
    const a = document.createElement('a');
    a.className = 'site-link';
    a.href = site.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = site.url || '';
    tdUrl.appendChild(a);

    // פעולות
    const tdActions = document.createElement('td');
    tdActions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn';
    editBtn.textContent = 'עריכה';
    editBtn.onclick = () => openEditForm(site);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn--danger';
    delBtn.textContent = 'מחיקה';
    delBtn.onclick = () => onDelete(site._id);

    tdActions.append(editBtn, delBtn);

    tr.append(tdImg, tdName, tdUrl, tdActions);
    tbody.appendChild(tr);
  });
}

// ---- עריכה בטופס ----
function openEditForm(site) {
  currentEdit = site;
  // מילוי הטופס
  setVal('#editId', site._id);
  setVal('#editName', site.name ?? '');
  setVal('#editUrl', site.url ?? '');
  setVal('#editImage', site.image ?? '');
  setVal('#editScore', site.score ?? '');

  // הצגה
  get('#editSection').hidden = false;
  // גלילה לטופס (נחמד, לא חובה)
  get('#editSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bindEditForm() {
  const form = get('#editForm');
  const cancelBtn = get('#cancelEdit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id    = getVal('#editId');
    const body  = {
      name:  getVal('#editName').trim(),
      url:   getVal('#editUrl').trim(),
      image: getVal('#editImage').trim(),
      score: Number(getVal('#editScore'))
    };

    try {
      const res = await fetch(`/sites/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errBody = await safeJson(res);
        console.error('PUT failed', errBody);
        alert('עדכון נכשל (בדקי שהשדות עומדים ב-Joi)');
        return;
      }
      // ניקוי והסתרה
      form.reset();
      get('#editSection').hidden = true;
      currentEdit = null;
      await loadSites();
    } catch (err) {
      console.error(err);
      alert('שגיאה בעדכון');
    }
  });

  cancelBtn.addEventListener('click', () => {
    form.reset();
    get('#editSection').hidden = true;
    currentEdit = null;
  });
}

// ---- מחיקה ----
async function onDelete(id) {
  if (!id) return;
  const ok = confirm('למחוק את הרשומה?');
  if (!ok) return;

  try {
    const res = await fetch(`/sites/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('מחיקה נכשלה');
    await loadSites();
  } catch (err) {
    console.error(err);
    alert('שגיאה במחיקה');
  }
}

// ---- עזר ----
function get(sel){ return document.querySelector(sel); }
function getVal(sel){ const el=get(sel); return el ? el.value : ''; }
function setVal(sel,val){ const el=get(sel); if(el) el.value = val; }
async function safeJson(res){ try { return await res.json(); } catch { return null; } }
