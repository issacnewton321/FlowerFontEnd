import React,{useContext,useEffect} from 'react'
import {useHistory,useParams} from 'react-router-dom'
import axios from 'axios'
const Activate = ()=>{
    const register = JSON.parse(window.localStorage.getItem('register'))
    const history = useHistory();
    useEffect(()=>{
        if(register == null)
        history.push('/')
    else{
        axios.post(process.env.REACT_APP_API +'register',register)
        .then(response => window.localStorage.removeItem('register'))
        .catch(error => console.log(error) )
    }
    },[])
    return(
        <div className='container mt-4'>
            <h4 className="lead text-success mt-4">Tài khoản kích hoạt thành công !!!</h4>
            <div className='mt-4'>
                <button className="btn btn-outline-info mr-4" onClick={()=> history.push('/')}>Trang chủ</button> <span> --- Trở về trang chủ --- </span>            
            </div>
        </div>
    )
}

export default Activate