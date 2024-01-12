const querystring = require('querystring');
 import axios from 'axios';
 
 
 const Authorization = () => {
    return encodeURI(`https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.LINKEDIN_CLIENT_ID}&response_type=code&scope=${process.env.Scope}&redirect_uri=${process.env.Redirect_Url}`);
  };

  const authorizationUrl = Authorization();
console.log(authorizationUrl);
  

// const Redirect = async (code) => {
//     const payload = {
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: process.env.Redirect_Url,
//         client_id: process.env.LINKEDIN_CLIENT_ID,
//         client_secret: process.env.LINKEDIN_CLIENT_SECRET,
//     };


//     console.log(payload, "client_secret");


//     try {
//         const { data } = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', querystring.stringify(payload), {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         });
//         return data;
//     } catch (error) {
//         return error;
//     }
// };

const Redirect = async (code) => {
    const payload = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.Redirect_Url,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    };
  
    console.log(payload, "client_secret");
  
    try {
      const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', querystring.stringify(payload), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      console.log(response.data); // Log the entire response to check for the access token and other details
  
      // Extract the access token from the response if needed
      const accessToken = response.data.access_token;
  
      // Continue with fetching user profile using the access token
      // ...
    } catch (error) {
      console.error('Error in Redirect:', error);
      throw error;
    }
  };
  const fetchUserProfile = async (accessToken) => {
    try {
      const { data } = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log(data); // Log the user profile data
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };  
module.exports={
    Authorization, Redirect
}