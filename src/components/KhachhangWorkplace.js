import React,{useState,useEffect} from 'react'
import axios from 'axios'
import './SanphamWorkplace.css'
function Admin_workplace({slide}){
    const [on,setOn] = useState(false)
    const header = {
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('jwt') //the token is a variable which holds the token
          }
    }
    const [khachhang,setkhachhang] = useState([]);
    const [search,setSearch] = useState('')
    useEffect(()=>{
        axios.get(process.env.REACT_APP_API+'khachhang/',header)
        .then(response => setkhachhang(response.data))
        .catch(erro => console.log(erro))
    },[])
    const getDeleteKH = (matk)=>{
        let agree = window.confirm(`Bạn có muốn xóa khách hàng makh = ${matk}?`);
        if (!agree)
        return
        axios.delete(process.env.REACT_APP_API+'khachhang/'+matk,header)
        .then(response => {
            
            axios.get(process.env.REACT_APP_API+'khachhang/',header)
            .then(response => 
                {
                    setkhachhang(response.data)
                    alert('Xóa thành công !!!')
                } )
            .catch(erro =>alert('Xóa thất bại !!!'))
            
        } )
        .catch(erro => console.log(erro))
    }
    const handleChange = (e)=>{
        const {value} = e.target;
        setSearch(value);
    }
    return(
        <div className={slide?"workplace":"on-off-workplace"}>
                <h3 className={!on?"form-head":"d-none"}>DANH SÁCH KHÁCH HÀNG </h3>  
                <ul className={!on?"form-func":"d-none"}>
                        <li className="setting_form"><i className="fa fa-cogs" aria-hidden="true"></i></li>
                        <li className="find_form_li"><i className="fa fa-search" aria-hidden="true"></i> <input type="text" onChange={handleChange} className = "find_form"/> </li>
                </ul>
                <div className={!on?"workplace_display":"d-none"}>
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-success">
                            <tr>
                                <th>MÃ KHÁCH HÀNG</th>
                                <th>HỌ TÊN KHÁCH HÀNG</th>
                                <th>ĐỊA CHỈ</th>
                                <th>SỐ ĐIỆN THOẠI</th>
                                <th>EMAIL</th>
                                <th>GIỚI TÍNH</th>
                                <th>USERNAME</th>
                                <th>DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {khachhang.map(kh =>{
                                const gender = ()=>{
                                    if(kh.gioitinh == '0'){
                                        return 'Nữ'
                                    }
                                    else if(kh.gioitinh == '1')
                                        return 'Nam'
                                    else
                                        return 'Khác'
                                }
                                if((kh.ho +' '+ kh.ten).toLowerCase().includes(search.toLowerCase()))
                                return (
                                    <tr key={kh.makh}>
                                       <td>{kh.makh}</td>
                                       <td>{kh.ho +' '+ kh.ten}</td>
                                       <td>{kh.diachi}</td>
                                       <td>{kh.sdt}</td>
                                       <td>{kh.email}</td>
                                       <td>{gender()}</td>
                                       <td>{kh.taikhoan?.username}</td>
                                       <td className="custom"><p className="custom-link" onClick={()=> getDeleteKH(kh.taikhoan.matk)}>Delete</p> </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>         
                </div>
                <div>
                
            
        </div>
        </div>
    )
}
export default Admin_workplace