import { Grid } from '@material-ui/core'
import React,{useState,useEffect,useContext} from 'react'
import './Topbar.css'
import {UserContext} from '../context/UserContext'
import axios from 'axios'
import MessengerCustomerChat from 'react-messenger-customer-chat';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    Redirect
  } from "react-router-dom";
import { get } from 'react-hook-form';
function Topbar(){
    const [sl,setSl] = useContext(UserContext)
    const [user,setUser] = useState(null);
    const [userUpdate,setUserUpdate] = useState(null)
    let history = useHistory();
   // const [logout,setLogout] = useState(false);
    const myStore = window.localStorage;
    const [open,setOpen] = useState(false)
    const jwt = myStore.getItem('jwt')
    const header = {
        headers: {
            Authorization: 'Bearer ' + jwt //the token is a variable which holds the token
          }
    }
    const username = myStore.getItem('username')
    const initialUserUpdate = (data)=>{
        setUserUpdate({
            username : data.taikhoan?.username,
            password : data.taikhoan?.password,
            ho:data.ho,
            ten:data.ten,
            gioitinh:data.gioitinh,
            sdt:data.sdt,
            email:data.email,
            diachi:data.diachi
        })
    }
    useEffect(()=>{
        if(username)
        {
          axios.get(process.env.REACT_APP_API +'khachhang/'+username,header)
        .then(response => {
          axios.get(process.env.REACT_APP_API +'numcart/'+response.data.makh,header)
          .then(res => setSl(res.data))
          .catch(err => console.log(err))

          setUser(response.data) ; 
          initialUserUpdate(response.data)
        })
        .catch(error => console.log(error))  

        
        }
    },[])
    const isLogin = ()=>{
        if(user!=null){
            return (
                <div onMouseEnter={()=>setOpen(true)} onMouseLeave={()=> setOpen(false)}>
                    <p className="login item mr-3"><i className="fa fa-user-circle fa-lg" aria-hidden="true" ></i> {user?.ho +' ' +  user?.ten}</p>
                    {open?
                        <div class="myAccount" style={{zIndex:1}}>
                            <p data-toggle="modal" data-target="#accountInfo"><i class="fa fa-user" aria-hidden="true"></i> Thông tin tài khoản</p>
                            <p onClick={()=> history.push('/viewOrder')}><i class="fa fa-shopping-bag" aria-hidden="true"></i> Đơn hàng của tôi</p>
                        </div> :''  
                     }
                </div>
            )
        }
        else
            return (
                <p onClick={()=>{history.push('/login')}} className="login item mr-3"><i className="fa fa-user-circle fa-lg" aria-hidden="true"></i> Đăng nhập</p>
            )
    }
    const isLogout = ()=>{
        if(user != null){            
            return (
                <p onClick={()=>{myStore.removeItem('username'); myStore.removeItem('jwt'); history.push("/") ;window.location.reload(false) }} className="login item ml-3"><i class="fa fa-sign-out fa-lg" aria-hidden="true"></i> Đăng xuất</p>
            )
        }
        else
            return '';
    }
    const handleChange = (e)=>{
        const {name,value} = e.target;
        setUserUpdate({
            ...userUpdate,
            [name]:value
        })
    }
    const submitUpdate = ()=>{
        axios.put(process.env.REACT_APP_API +'khachhang/',userUpdate,header)
        .then(response => alert('Sửa thành công'))
        .catch(error => console.log(error))
    }
      
    return (
        <div>
            <MessengerCustomerChat
                pageId="575303299345434"
                appId="2594387300854202"
            />
            <div className='d-none d-sm-block'>
                <div className='topbar d-flex justify-content-around'>
                    <div className='topbar__contact d-flex'>              
                        <p className='mr-3'>Hongquan080799@gmail.com</p>
                        <p>0336781801</p>
                    </div>
                    <div className='topbar__more d-flex'>
                        {isLogin()}
                        <Link to='/cart'>
                         <p className="cart item mr-3"><i className="fa fa-shopping-cart fa-lg" aria-hidden="true"></i>{username?<span className='index'>{sl}</span>:''} Giỏ hàng</p>
                        </Link>
                        <p className="login item"><i className="fa fa-bell fa-lg"></i><span className='index'>1</span> Thông báo</p>
                        {isLogout()}
                    </div>
                </div>
            </div>
            <div className='d-block d-sm-none'>
                <div className='topbar d-flex justify-content-around'>
                    <div className='topbar__contact d-flex'>              
                        <p className='mr-3'>Hongquan080799@gmail.com</p>
                        <p>0336781801</p>
                    </div>
                    <div className='topbar__more d-flex'>
                         <p className="login item mr-3"><i className="fa fa-user-circle fa-lg" aria-hidden="true"></i></p>
                        <p className="cart item mr-3"><i className="fa fa-shopping-cart fa-lg" aria-hidden="true"></i><span className='index'>1</span></p>
                        <p className="login item"><i className="fa fa-bell fa-lg"></i><span className='index'>1</span></p>
                    </div>
                </div>
            </div>
            {/* modal */}
            <div className="modal fade" id="accountInfo" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">THÔNG TIN TÀI KHOẢN</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    
                    <div className="modal-body">
                        <h5>Thông tin về khách hàng : {user?.ho + ' ' + user?.ten}</h5>
                      <div className="table-responsive">
                      <table className="table table-borderless table-font mt-4">
                        <tbody>
                          <tr>
                            <td>Họ</td>
                            <td><input type="text" className="form-control mb-2 mr-sm-2" defaultValue={user?.ho} name="ho" onChange={handleChange}/></td>
                          </tr>
                          <tr>
                            <td>Tên</td>
                            <td><input type="text" className="form-control mb-2 mr-sm-2" defaultValue={user?.ten} name="ten" onChange={handleChange} /></td>
                          </tr>
                          <tr>
                            <td>Giới tính</td>
                            <td> 
                                <select className="custom-select my-1 mr-sm-2" defaultValue={user?.gioitinh} name="gioitinh" onChange={handleChange}>
                                    <option defaultValue={0}>Nam</option>
                                    <option defaultValue={1}>Nữ</option>
                                </select> 
                            </td>
                          </tr>
                          <tr>
                            <td>Số điện thoại</td>
                            <td><input type="text" className="form-control mb-2 mr-sm-2" defaultValue={user?.sdt} name="sdt" onChange={handleChange}/></td>
                          </tr>
                          <tr>
                            <td>Email</td>
                            <td><input type="text" className="form-control mb-2 mr-sm-2" defaultValue={user?.email} name="email" onChange={handleChange}/></td>
                          </tr>
                          <tr>
                            <td>Địa chỉ</td>
                            <td><input type="text" className="form-control mb-2 mr-sm-2" defaultValue={user?.diachi} name="diachi" onChange={handleChange}/> </td>
                          </tr>
                          <tr>
                            <td>User?name</td>
                            <td><input type="text" className="form-control mb-2 mr-sm-2" defaultValue={user?.taikhoan?.username} name="username" onChange={handleChange}/></td>
                          </tr>
                          <tr>
                            <td>Password</td>
                            <td><input type="text" className="form-control mb-2 mr-sm-2" defaultValue={user?.taikhoan?.password} name="password" onChange={handleChange}/></td>
                          </tr>
                        </tbody>
                      </table>
                      </div>
                      
            
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={()=>initialUserUpdate(user)}>Thoát</button>
                      <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={submitUpdate}>Lưu thay đổi</button>
                    </div>
                  </div>
                </div>
              </div>
            
        </div>
    )

}
export default Topbar;