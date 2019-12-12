const admin = {
    id:1,
    username: "admin",
    password: "admin",
    account_type:0,
    first_name:"admin",
    last_name:"admin",
    active:true,
    modified_on:null,
    modified_by: null,
    version:0
}

const workers = [

    {
        id:2,
        username: "worker1",
        password: "worker1",
        account_type:1,
        first_name:"worker1",
        last_name: "worker1",
        active:true,
        modified_on:null,
        modified_by: null,
        version:0
    },
    
    {
        id:3,
        username: "worker2",
        password: "worker2",
        account_type:1,
        first_name:"worker2",
        last_name:"worker2",
        active:true,
        modified_on:null,
        modified_by: null,
        version:0
    }
]

const contacts = [

    {
        id:4,
        username: "contact1",
        password: "contact1",
        account_type:2,
        first_name:"contact1",
        last_name:"contact1",
        active:true,
        modified_on:null,
        modified_by: null,
        version:0
    },

    {
        id:5,
        username: "contact2",
        password: "contact2",
        account_type:2,
        first_name:"contact2",
        last_name:"contact2",
        active:true,
        modified_on:null,
        modified_by: null,
        version:0
    }
]

const childs = [
    {
        id:7,
        username: "child1",
        password: "child1",
        account_type:3,
        first_name:"child1",
        last_name:"child1",
        active:true,
        modified_on:null,
        modified_by: null,
        version:0
    },

    {
        id:8,
        username: "child2",
        password: "child2",
        account_type:3,
        first_name:"child2",
        last_name:"child2",
        active:true,
        modified_on:null,
        modified_by: null,
        version:0
    },

    {
        id:9,
        username: "child3",
        password: "child3",
        account_type:3,
        first_name:"child3",
        last_name:"child3",
        active:true,
        modified_on:null,
        modified_by: null,
        version:0
    }
]


const emptyUser = {
    id:-1,
    username: "",
    password: "",
    account_type:-1,
    first_name:"",
    last_name:"",
    active:true,
    modified_on:null,
    modified_by: null,
    version:0
}

const wrongUser = {
    id:-1,
    username: "wrongUser1'SELECT * FROM;---",
    password: "wrongUser123456789123456789123456789123456789123456789123456789",
    account_type:-1,
    first_name:"WrongUser",
    last_name:"WrongUser",
    active:true,
    modified_on:null,
    modified_by: null,
    version:0
}

const responseLogin412 = {
    status:412,
    body : {
        success :false,
        error: "Password and username needed"
    },
    type : "application/json"
}

const responseLogin413 = {
    status: 413,
    body : {
        success: false,
        error:"Invalid username/password"
    },
    type: "application/json"
}

//Connecting worker1 according to test case
const responseLogin = {
    status: 200,
    body : {
        success: true,
        user :  {
            id:2,
            username: "worker1",
            password: "worker1",
            account_type:1,
            first_name:"worker1",
            last_name:"worker1",
            active:true,
            modified_on:null,
            modified_by: null,
            version:0
        },
        token: ""
    },
    type : "application/json"
}

const responseAddUser412 = {
    status:412,
    body : {
        success:false,
        error:"Wrong data sent!"
    },
    type: "application/json"
}

const responseCannotAdd = {
    status:500
}



exports.admin = admin;
exports.workers = workers;
exports.contacts = contacts;
exports.childs = childs;
exports.emptyUser = emptyUser;
exports.wrongUser = wrongUser;
exports.responseLogin412 = responseLogin412;
exports.responseLogin413 = responseLogin413;
exports.responseAddUser412 = responseAddUser412;
exports.responseLogin = responseLogin;
exports.responseCannotAdd = responseCannotAdd;