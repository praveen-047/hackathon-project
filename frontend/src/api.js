import Cookies from 'js-cookie'

const api_url = 'http://localhost:5000'

export async function login(email,password,role){
    const url = `${api_url}/auth/login`
    const options = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password,role})
    }
    const res = await fetch(url,options)

    return res
}

export async function register(user){
    const url = `${api_url}/auth/register`

    const token = Cookies.get("jwt_token");

    const options = {
        method: "POST",
        headers: {"Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
        },
        body:JSON.stringify(user)
    }

    const res = await fetch(url,options)
    return res.json();
}



export async function jobPost(jobData) {
  const token = Cookies.get("jwt_token");

  const res = await fetch("http://localhost:5000/admin/jobpost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  const data = await res.json()
  
  return data; // { message: 'Job post created successfully', jobId }
}


export async function blogPost(blogData) {
  const token = Cookies.get("jwt_token");

  const res = await fetch("http://localhost:5000/admin/blogpost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(blogData),
  });

  const data = await res.json()
  return data;
}