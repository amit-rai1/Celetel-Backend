
const config = {
    local: {
        DB:{
            HOST: "127.0.0.1",
            PORT: "27017",
            DATABASE: "Celetel",
            UserName: "",
            Password: ""
        },
        PORTNO : 8600,
       
    },

    staging: {
        DB:{
            HOST: "0.0.0.0",
            PORT: "27017",
            DATABASE: "test",
            MONGOOSE:{
                useUndifinedTopology: true,
                useNewUrlParser: true
            },
            UserName: "celetel",
            Password: "Dun3cC38Ah@Vg$T"
        },
        
            
        PORTNO : 7600,
        
    },
}
export const get = function get (env){
    return config[env];
}