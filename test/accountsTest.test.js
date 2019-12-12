const macha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../modules/server');
var should = chai.assert;
chai.use(chaiHttp);

const expect = chai.expect;
const assert = chai.assert;

//Test data
const data = require('./data');


describe('Integration Test case of login in auth.js', () => {

    it('username missing', () => {
        chai.request(server.app).post("/login").send({
            username: "",
            password:data.workers[0].password
        }).end((err, res) => {
            assert.equal(res.status, data.responseLogin412.status);
            assert.equal(res.body.success, data.responseLogin412.body.success);
            assert.equal(res.body.error, data.responseLogin412.body.error);
            assert.equal(res.type, data.responseLogin412.type);
        });
    });

    it('password missing', () => {
        chai.request(server.app).post("/login").send({
            username: data.workers[0].password,
            password:""
        }).end((err, res) => {
            assert.equal(res.status, data.responseLogin412.status);
            assert.equal(res.body.success, data.responseLogin412.body.success);
            assert.equal(res.body.error, data.responseLogin412.body.error);
            assert.equal(res.type, data.responseLogin412.type);
        });
    });

    it('password and username missing', () => {
        chai.request(server.app).post("/login").send({
            username: "",
            password:""
        }).end((err, res) => {
            assert.equal(res.status, data.responseLogin412.status);
            assert.equal(res.body.success, data.responseLogin412.body.success);
            assert.equal(res.body.error, data.responseLogin412.body.error);
            assert.equal(res.type, data.responseLogin412.type); 
        });
    });

    it('invalid regex username', () => {
        chai.request(server.app).post("/login").send({
            username: "worker1'SELECT * FROM;---",
            password:data.workers[0].password
        }).end((err, res) => {
            assert.equal(res.status, data.responseLogin413.status);
            assert.equal(res.body.success, data.responseLogin413.body.success);
            assert.equal(res.body.error, data.responseLogin413.body.error);
            assert.equal(res.type, data.responseLogin413.type); 
        });
    });

    it('invalid regex username', () => {
        chai.request(server.app).post("/login").send({
            username: "worker123456789123456789123456789123456789",
            password:data.workers[0].password
        }).end((err, res) => {
            assert.equal(res.status, data.responseLogin413.status);
            assert.equal(res.body.success, data.responseLogin413.body.success);
            assert.equal(res.body.error, data.responseLogin413.body.error);
            assert.equal(res.type, data.responseLogin413.type); 

        });
    });

    it('Login Ok', () => {
        chai.request(server.app).post("/login").send({
            username:data.workers[0].username,
            password:data.workers[0].password
        }).end((err, res) => {
            assert.equal(res.status, data.responseLogin.status);
            assert.equal(res.body.success, data.responseLogin.body.success);
            assert.equal(res.body.user.id, data.responseLogin.body.user.id);
            assert.equal(res.body.user.username, data.responseLogin.body.user.username);
           //Never returning the password
            assert.equal(res.body.user.password, null);
            assert.equal(res.body.user.account_type, data.responseLogin.body.user.account_type);
            assert.equal(res.body.user.first_name, data.responseLogin.body.user.first_name);
            assert.equal(res.body.user.last_name, data.responseLogin.body.user.last_name);
            
            assert.equal(res.type, data.responseLogin.type);
        });
    });
});



//Set of test cases
/*describe('Test case of addUser in account.js', () => {
    //Test case
    it('Admin add user with wrong account_type', () => {

        chai.request(server.app).post("/addUser").send({
            accountType:data.emptyUser.account_type,
            firstname:data.workers[0].first_name,
            lastname:data.workers[0].last_name,
            username:data.workers[0].username,
            password:data.workers[0].password
        
        }).end((err, res) => {
            assert.equal(res.status, data.responseAddUser412.status);
            assert.equal(res.type, data.responseAddUser412.type);
            assert.equal(res.body.success, data.responseAddUser412.body.success);
            assert.equal(res.body.error, data.responseAddUser412.body.error);
        });
    });
});*/




