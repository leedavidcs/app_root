db = db.getSiblingDB("stock-app_mongodb");

db.createUser({
    user: "root",
    pwd: "dev_password",
    roles: [{
        role: "readWrite",
        db: "stock-app_mongodb"
    }]
});
