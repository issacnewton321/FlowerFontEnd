import React,{useState,useEffect} from 'react'
import SanphamWorkplace from './SanphamWorkplace'
import DanhMucWorkplace from './DanhMucWorkplace'
import Donhang from './Donhang_workplace'
import axios from 'axios'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Link,
    useParams,
    useHistory
  } from "react-router-dom";


function Nhanvien(){
    const [user,setUser] = useState(null);
    const [donhang,setDonhang] = useState([])
    const myStore = window.localStorage;
    const quyen = myStore.getItem('quyen')
    const jwt = myStore.getItem('jwt')
    const [find,setFind] = useState('');
    const header = {
        headers: {
            Authorization: 'Bearer ' + jwt //the token is a variable which holds the token
          }
    }
    const history = useHistory()
    const username = myStore.getItem('username')
    useEffect(()=>{
        if(quyen != 3)
            history.push('/')
        if(username)
        {
          axios.get(process.env.REACT_APP_API +'nhanvien/'+username,header)
        .then(response => {
          
          setUser(response.data) ; 
        })
        .catch(error => console.log(error))  
        }
        else{
            history.push("/")
        }
    },[])
    
    
    let {nhanvienPage} = useParams();
    const [slide,setSlide] = useState(true)
    let Page = '';
    switch(nhanvienPage){
        case 'sanpham':{
            Page = <SanphamWorkplace slide={slide}/>
            break;
        }
        case 'index':{
            Page = <div style={{maxWidth:'85%',height:'92vh'}}><img src="https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg" alt="picture" style={{width:'100%',height:'100%',overflowY:'hidden'}}/></div>
            break;
        }
        case 'danhmuc':{
            Page = <DanhMucWorkplace slide={slide}/>
            break;
        }
        case 'donhang':{
            Page = <Donhang slide={slide} user={user}/>
            break;
        }
    }
    return(
        <div>
            <div className='header-admin'>       
                <h3 className="logo-admin"><span className="slide-button" onClick={toggleSlide}><i className="fa fa-bars" aria-hidden="true"></i></span>Quản lý kho <span className="logo-name">FAS ENTERPRISE</span></h3>
                <p onClick={()=>{myStore.removeItem('user'); myStore.removeItem('jwt') ; history.push("/")}} className="logout"><i className="fa fa-sign-out" aria-hidden="true"></i>Đăng xuất</p>
            </div>
            <div className='body-admin'>
                <div className={slide?"slide-bar":'slide-bar on-off'}  >
                    <div className={slide?"employee":"employee on-off-employee"}>
                        <div className="employee-image">
                            <i className="fa fa-user-circle" aria-hidden="true"></i>
                        </div>
                        <h4 className="employee-name">{user?.ho + ' ' + user?.ten}</h4>
                    </div>
                    <div className={slide?"slide-bar_list":"slide-bar_list on-off-menu"}>
                        <Link to="/nhanvien/sanpham"><p><i className="fa fa-list-alt" aria-hidden="true"></i><span className="ml-2" >Danh sách sản phẩm</span></p></Link>
                        <Link to="/nhanvien/danhmuc"><p><i className="fa fa-users" aria-hidden="true"></i><span className="ml-2">Danh sách danh mục</span></p></Link>
                        <Link to="/nhanvien/donhang"><p><i className="fa fa-calendar-check-o" aria-hidden="true"></i><span className="ml-2">Danh sách đơn hàng</span></p></Link>
                    </div>
                    
                </div>
                {Page}
            </div>
        </div>       
    )
    function toggleSlide(){
        setSlide(!slide)
    }
    
}

export default Nhanvien