import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import './SanphamWorkplace.css'
function Donhang_workplace
({slide,user}){
    const {quyen} = useParams()
    const [on,setOn] = useState(false)
    const [input,setInput] = useState({})
    const header = {
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('jwt') //the token is a variable which holds the token
          }
    }
    const [donhang,setDonhang] = useState([]);
    const [search,setSearch] = useState('')
    useEffect(()=>{
        axios.get(process.env.REACT_APP_API+'donhang/',header)
        .then(response => setDonhang(response.data))
        .catch(erro => console.log(erro))

    },[])
    const getDeleteDH = (madh)=>{
        let agree = window.confirm(`Bạn có muốn xóa madh = ${madh}?`);
        if (!agree)
        return
        axios.delete(process.env.REACT_APP_API+'donhang/'+madh,header)
        .then(response => {
            
            axios.get(process.env.REACT_APP_API+'donhang/',header)
            .then(response => {
                setDonhang(response.data)
                alert("Xóa thành công !!!")
            })
            .catch(erro =>  alert('Xóa thất bại !!!'))
            
        } )
        .catch(erro => console.log(erro))
    }
    // const getInsertTK = ()=>{
    //     setOn(true); 
    // }
    // const updateInput = (e)=>{
    //     const {name,value} = e.target;
    //     setInput({
    //         ...input,
    //         [name]:value
    //     })
    // }
    // const handleSubmit = (e)=>{
    //     e.preventDefault();
    //     axios.get(process.env.REACT_APP_API+'IsUserExits/'+ input.username)
    //     .then(response => {alert('Đã tồn tại username này !!!'); return})
    //     .catch(ero=>{
    //         axios.post(process.env.REACT_APP_API +'nhanvien',input,header)
    //         .then(res => {
    //             alert('Thêm nhân viên thành công !!!')
    //             axios.get(process.env.REACT_APP_API+'nhanvien/',header)
    //             .then(response => setnhanvien(response.data))
    //             .catch(erro => console.log(erro))
    //             setOn(false)
    //         })
    //         .catch(err => {console.log(err) ; alert('Thêm thất bại !!!')})
    //     })
    // }
    const handleSearch = (e)=>{
      const {value} = e.target
      setSearch(value)
    }
    const changeTT = (e,dh)=>{
      if(window.confirm('Bạn có muốn thay đổi trạng thái đơn hàng'))
      {
        const {value} = e.target
      dh.trangthai = value
      dh.nhanvien = user
      axios.put(process.env.REACT_APP_API+'donhang/',dh,header)
      .then(res => 
        axios.get(process.env.REACT_APP_API+'donhang/',header)
        .then(response => setDonhang(response.data))
        .catch(erro => console.log(erro))
        )
      .catch(err => console.log(err))
      }
      else{
        window.location.reload();
      }
    }
    return(
        <div className={slide?"workplace":"on-off-workplace"}>
                <h3 className={!on?"form-head":"d-none"}>DANH SÁCH ĐƠN HÀNG</h3>  
                <ul className={!on?"form-func":"d-none"}>
                        <li className="setting_form"><i className="fa fa-cogs" aria-hidden="true"></i></li>
                        {/* <li className="add_form"><i className="fa fa-plus-square-o" aria-hidden="true"></i>ADD</li> */}
                        <li className="find_form_li"><i className="fa fa-search" aria-hidden="true"></i> <input type="text" className = "find_form" onChange={handleSearch}/> </li>
                </ul>
                <div className={!on?"workplace_display":"d-none"}>
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-success">
                            <tr>
                                <th>MÃ ĐƠN HÀNG</th>
                                <th>TỔNG TIỀN</th>
                                <th>NGÀY ĐẶT</th>
                                <th>TRẠNG THÁI</th>
                                <th>HÌNH THỨC THANH TOÁN</th>
                                <th>MÃ NHÂN VIÊN</th>
                                <th>TÊN NHÂN VIÊN</th>
                                <th>MÃ KHÁCH HÀNG</th>
                                <th>TÊN KHÁCH HÀNG</th>
                                <th>XEM CHI TIẾT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donhang.map(dh =>{
                              let tt = '';
                              if(dh.trangthai == 4)
                                tt = 'Đã Hủy'
                              else if(dh.trangthai == 3)
                               tt = 'Đã giao hàng'
                              if(dh.madh.toLowerCase().includes(search.toLowerCase()))
                                return (
                                    <tr key={dh.madh}>
                                        <td>{dh.madh}</td>
                                       <td>{dh.tongtien}</td>
                                       <td>{dh.ngaydat}</td>
                                       <td>
                                           {tt == ''?
                                            <select className="custom-select my-1 mr-sm-2" defaultValue={dh.trangthai} onChange={(e)=>changeTT(e,dh)}>
                                                {dh.trangthai == 0 ?<option value={0}>Chờ xử lý</option>:''}
                                                {dh.trangthai == 0 || dh.trangthai == 1 ?<option value={1}>Đã xác nhận</option>:''} 
                                                {dh.trangthai == 0 || dh.trangthai == 1 || dh.trangthai ==2 ?<option value={2}>Đang gửi</option>:''} 
                                                <option value={3}>Đã gửi</option>
                                                <option value={4}>Đã hủy</option>
                                                 
                                            </select>:
                                            <p className='text-secondary' style={{fontSize:18,fontStyle:'italic'}}>{tt}</p>
                                            
                                          }
                                       </td>
                                       <td>{dh.hinhthucthanhtoan==1?'Tiền mặt':'Thẻ'}</td>
                                       <td>{dh.nhanvien?.manv}</td>
                                       <td>{dh.nhanvien?dh.nhanvien?.ho + ' ' + dh.nhanvien?.ten : ''}</td>
                                       <td>{dh.khachhang?.makh}</td>
                                       <td>{dh.khachhang?.ho + ' ' + dh.khachhang?.ten}</td>
                                       <td>
                                             <button type="button" className="btn btn-primary" data-toggle="modal" data-target={'#'+dh.madh}>
                                                   Xem
                                             </button>
                                             <div className="modal fade" id={dh.madh} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                 <div className="modal-dialog" role="document">
                                                   <div className="modal-content">
                                                     <div className="modal-header">
                                                       <h5 className="modal-title" id="exampleModalLabel">Chi tiết đơn hàng {dh.madh}</h5>
                                                       <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                         <span aria-hidden="true">×</span>
                                                       </button>
                                                     </div>
                                                     <div className="modal-body">
                                                       <div className="table-responsive">
                                                       <table className="table table-striped table-bordered table-hover">
                                                         <thead>
                                                           <tr>
                                                             <th scope="col">Mã sản phẩm</th>
                                                             <th scope="col">Tên sản phẩm</th>
                                                             <th scope="col">Hình ảnh</th>
                                                             <th scope="col">Số lượng</th>
                                                             <th scope="col">Đơn giá</th>
                                                           </tr>
                                                         </thead>
                                                         <tbody>
                                                           {dh.listCTDH?.map(ct=>(
                                                               <tr key={ct.sanpham?.masp}>
                                                                   <td>{ct.sanpham?.masp}</td>
                                                                   <td>{ct.sanpham?.tensp}</td>
                                                                   <td><img alt="pc" src={ct.sanpham?.photo} style={{width:70}}/></td>
                                                                   <td>{ct.soluong}</td>
                                                                   <td>{ct.sanpham?.dongia + 'đ'}</td>
                                                               </tr>
                                                           ))}
                                                         </tbody>
                                                       </table>
                                                       </div>
                                                       
                                             
                                                     </div>
                                                     <div className="modal-footer">
                                                       <button type="button" className="btn btn-info" data-dismiss="modal">Thoát</button>
                                                     </div>
                                                   </div>
                                                 </div>
                                               </div>
                                       </td>

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
export default Donhang_workplace
