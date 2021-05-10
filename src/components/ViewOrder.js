import React,{useState,useEffect} from 'react'
import axios from 'axios'
import './ViewOrder.css'
import {useHistory} from 'react-router-dom'

const ViewOrder = ()=>{
 
    const [user,setUser] = useState(null);
    const [donhang,setDonhang] = useState([])
    const myStore = window.localStorage;
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
        if(username)
        {
          axios.get(process.env.REACT_APP_API +'khachhang/'+username,header)
        .then(response => {
          
          setUser(response.data) ; 
          axios.get(process.env.REACT_APP_API +'donhang/'+response.data.makh,header)
          .then(res => setDonhang(res.data))
          .catch(err => console.log(err))
        })
        .catch(error => console.log(error))  
        }
        else{
            history.push("/")
        }
    },[])
    
    const getTinhtrang = (tt)=>{
        if(tt === 4)
          return 'Đã hủy'
        else if(tt === 0)
          return 'Đang xác nhận'
        else if( tt === 1)
          return 'Đã xác nhận'
        else if(tt === 2)
          return 'Đang giao'
        else if(tt === 3)
          return 'Đã giao'
      }
      const huyDon=(madh)=>{
        const kq = window.confirm('Bạn có chắc muốn hủy đơn hàng này')
        if(kq){
          axios.put(process.env.REACT_APP_API +'donhang/'+madh,null,header)
        .then(res => {
          alert('Hủy đơn hàng thành công !!!')
          axios.get(process.env.REACT_APP_API +'donhang/'+user?.makh,header)
            .then(res => setDonhang(res.data))
            .catch(err => console.log(err))
        })
        .catch(err => alert('Hủy đơn thất bại'))
        }
      }
    return (
       <div className="container view-container">
           <div className="card view-order">
                <div className="card-header text-white bg-primary d-flex justify-content-between px-4">THÔNG TIN VỀ ĐƠN HÀNG</div>
                <div className="card-body">
                <div class="input-group mb-3" style={{width:'80%',margin:'auto'}}>
                    <input type="text" class="form-control" placeholder="Tìm kiếm đơn hàng" onChange={(e)=> setFind(e.target.value)}/>
                    <div class="input-group-append">
                        <button class="btn btn-info" type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                    </div>
                </div>
                <hr/>
                {donhang?.map(dh=>{
                    if(dh?.madh.toLowerCase().includes(find.toLowerCase()))
                    return (
                        <div style={{width:'100%',marginTop:40}}>
                          <h5 className="mb-2">Mã đơn hàng : {dh?.madh}</h5>
                          <h6>Ngày đặt : {dh?.ngaydat}</h6>
                          <h6>Tổng tiền : {dh?.tongtien} $</h6>
                          <h6>Tình trạng đơn hàng : {getTinhtrang(dh?.trangthai)}</h6>
                          {dh?.trangthai==0?<button className="btn btn-outline-danger mt-3" type="button" onClick={()=>huyDon(dh?.madh)}>Hủy đơn hàng</button>:''}
                          <h5 className="mt-4">Danh sách sản phẩm</h5>
                          <div className="table-responsive">
                          <table className="table table-borderless table-hover" style={{fontSize:19}} >
                            <tbody>
                              {dh?.listCTDH?.map(ct=>(
                                <div>
                                  <hr/>
                                  <tr>
                                    <td style={{color:'#868688'}}>Mã sản phẩm</td>
                                    <td>{ct.sanpham?.masp}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color:'#868688'}}>Tên sản phẩm</td>
                                    <td>{ct.sanpham?.tensp}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color:'#868688'}}>Số lượng</td>
                                    <td>{ct.soluong}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color:'#868688'}}>Giá</td>
                                    <td>{ct.sanpham?.dongia} $</td>
                                  </tr>
                                  <tr>
                                    <td style={{color:'#868688'}}>Hình ảnh</td>
                                    <td ><img src={ct.sanpham?.photo} alt="pt" style={{width:150}}/></td>
                                  </tr>
                                </div>
                              ))}
                            </tbody>
                          </table>
                          </div>
                          
                          <hr></hr>

                        </div>
                    )
                })} 
                </div>
            </div>  
       </div>
    )
}

export default ViewOrder