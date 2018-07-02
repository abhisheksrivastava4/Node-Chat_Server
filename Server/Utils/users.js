class Users {
    constructor (){
        this.users=[];
    }
    
    addUser(id, name, room){
    var user = {id, name, room};
    this.users.push(user)
    return user;
    }

    removeUser(id)
    {
        var user = this.users.filter((user)=> {
            return user.id === id}
        )[0];
        if(user){
           this.users = this.users.filter((user)=> user.id !== id);
        }
        return user;
    }

    getUser(id)
    {
     return this.users.filter((user)=> user.id === id)[0];
    }
    
    getUserList(room){
      var users = this.users.filter((user)=>user.room === room);
      var namesArray = users.map((user)=> user.name);
      return namesArray;
    }

    getUserByName(name,room){
        var nameListArray = this.getUserList(room);
        console.log(nameListArray)
        if(nameListArray[0]===name)
        {
            return true;
        }
        else
        return false;
    }
}

/* var users = new Users();
 var persons = [{
 id:1,
 name:"a",
 room:"A"
 },
{
    id:2,
    name:"b",
    room:"A"
},
{
    id:4,
    name:"c",
    room:"C"
},
{
    id:3,
    name:"c",
    room:"C"
}
]
users.addUser(persons[0].id, persons[0].name, persons[0].room);
users.addUser(persons[1].id, persons[1].name, persons[1].room);
users.addUser(persons[2].id, persons[2].name, persons[2].room);

//console.log(users.getUserList("A"));

//console.log(users.removeUser(20));

console.log(users.getUserByName('c','A'));*/


module.exports = {Users}