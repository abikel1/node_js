const indexR=require('./index');
const siteR=require('./sites');
const userR=require('./users');
const countryR=require('./countries');

exports.routesInit=(app)=>{
    app.use("/", indexR);
    app.use("/sites", siteR);
    app.use("/users", userR);
    app.use("/country", countryR);
};
