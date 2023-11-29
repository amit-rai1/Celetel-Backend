
const config = {
    local: {
        DB:{
            HOST: "127.0.0.1",
            PORT: "27017",
            DATABASE: "Celetel",
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
            DATABASE: "Celetel",
            MONGOOSE:{
                useUndifinedTopology: true,
                useNewUrlParser: true
            },
            UserName: "celetel",
            Password: "fAnOMHfaa9yEmv3v"
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