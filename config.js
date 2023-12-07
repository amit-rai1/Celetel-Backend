
const config = {
    local: {
        DB:{
            HOST: "127.0.0.1",
            PORT: "27017",
            DATABASE: "CeletelWeb",
            UserName: "",
            Password: ""
            
        },
        email: {
            username: "amit.rai@celetel.com",
            password: "Amr#1324"
        },
        PORTNO : 8600,

     
       
    },

    staging: {
        DB:{
            HOST: "0.0.0.0",
            PORT: "27017",
            DATABASE: "CeletelWeb",
            MONGOOSE:{
                useUndifinedTopology: true,
                useNewUrlParser: true
            },
            UserName: "lalit",
            Password: "393ZgOumwOPm3xdA"
        },
        email: {
            username: "amit.rai@celetel.com",
            password: "Amr#1324"
        },
            
        PORTNO : 8600,
        
    },
}
export const get = function get (env){
    return config[env];
}