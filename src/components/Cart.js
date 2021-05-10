import React,{useState,useEffect,useContext} from 'react'
import Detail_Portfolio from './Detail_Portfolio'
import hoa from '../image/hoa4.jpg'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../context/UserContext'
import './Cart.css'
import emailjs from 'emailjs-com';
export default function Cart(){
    let myStorage = window.localStorage;
    const [user,setUser] = useState({});
    const [total,setTotal] =useState(0)
    const history = useHistory();
    const header = {
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('jwt') //the token is a variable which holds the token
          }
      }
      const [sl,setSl] = useContext(UserContext)
      const [cart,setCart] = useState([])
      const [sanpham,setSanpham] = useState([])
      const getMaxSL = (masp)=>{
        let sl = 0;
        cart.forEach(c=>{
            if(c.sanpham?.masp === masp){
                sl = c.soluong;
            }
        })
        return sl;
    }
      let username = myStorage.getItem('username')
      useEffect(()=>{
          if(username == null)
            history.push('/login')
        
          else {
            axios.get(process.env.REACT_APP_API +'khachhang/'+username,header)
            .then(response => {
                setUser(response.data)
                axios.get(process.env.REACT_APP_API+`giohang/${response.data.makh}`,header)
                .then(response => {
                    setCart(response.data)
                    const temp = response.data.map(sanph =>{
                        return {
                            masp :sanph.sanpham?.masp,
                            soluong : sanph.soluong,
                            dongia : sanph.sanpham?.dongia,
                        }
                    })
                    
                    setSanpham(temp)
                })
                .catch(erro =>console.log(erro))
                
            })
            .catch(error => console.log(error))


            
            
          }

        
      },[])
      const deleteCart= (masp)=>{
        
        setSanpham(sanpham.filter(sp =>{
            if(sp.masp !== masp)
                return sp
        }))

        axios.delete(process.env.REACT_APP_API+`giohang/${user.makh}/${masp}`,header)
        .then(response => 
            axios.get(process.env.REACT_APP_API+`giohang/${user.makh}`,header)
            .then(response => {
                setCart(response.data)
                axios.get(process.env.REACT_APP_API +'numcart/'+user.makh,header)
                .then(res => setSl(res.data))
                .catch(err => console.log(err))
            })
            .catch(erro =>console.log(erro))    
        )
        .catch(erro =>console.log(erro))
      }
      const changeNum =(e,sp)=>{
        let masp = sp.masp
        let num = e.target.value;

        const newSP = sanpham.map(s =>{
            if(s.masp === masp){
                return {
                    ...s,
                    soluong:num
                }
            }
            else 
                return {...s}
        })
        setSanpham(newSP)

        axios.get(process.env.REACT_APP_API+`giohang/${user.makh}/${masp}?soluong=${num}`,header)
        .then(res =>{
            axios.get(process.env.REACT_APP_API+`giohang/${user.makh}`,header)
                .then(response => {
                    setCart(response.data)
                    axios.get(process.env.REACT_APP_API +'numcart/'+user.makh,header)
                    .then(res => setSl(res.data))
                    .catch(err => console.log(err))
                })
                .catch(erro =>console.log(erro))
        })
        .catch(err => console.log(err))

      }
      const checkSP = (e,sp,soluong)=>{


            const mySP = {...sp,soluong:soluong}


          if(e.target.checked){
                setSanpham([...sanpham,mySP])
                
          }
          else{
                setSanpham(sanpham.filter(s => s.masp !== sp.masp))
          }
          //console.log(sanpham)
      }
      useEffect(()=>{
          console.log(sanpham)
          let tam =0;
        sanpham.forEach(sp => {
            tam += Number(sp?.dongia) * Number(sp?.soluong)
            
        })
        setTotal(tam);
      },[sanpham])

      const tongsp = ()=>{
          let tong = 0;
         sanpham.forEach(sp=>{
             tong += Number(sp?.soluong);
         })
         return tong
      }
     const sendEmail = (myMessage)=>{
            var templateParams = {
                to_name:user.ho + ' '  + user.ten,
                from_name: 'Chủ tịch Hồng Quân',
                message:myMessage,
                url:'https://scontent.fsgn5-7.fna.fbcdn.net/v/t1.6435-9/79771446_2469549519965437_8172007245870006272_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=pLCmJOHT02EAX9MvKRe&_nc_ht=scontent.fsgn5-7.fna&oh=fc6dd68ebb012af9470ac03ddc02817c&oe=60B45DDC',
                notes: 'Check this out!',
                email:user?.email
            };
             
            emailjs.send('service_c4h4x3s', 'template_iy1y5te', templateParams,'user_eXT3mcACRHWvnrHkCZPaZ')
                .then(function(response) {
                   console.log('SUCCESS!', response.status, response.text);
                }, function(error) {
                   console.log('FAILED...', error);
                });
        } 
      const order = ()=>{
        axios.post(process.env.REACT_APP_API+`donhang/${user.makh}`,sanpham,header)
        .then(res => {
            alert('Đặt hàng thành công'); 
            const myMessage = myEmail
            sendEmail(myMessage);
            setSanpham([]);
            axios.get(process.env.REACT_APP_API+`giohang/${user.makh}`,header)
            .then(response => setCart(response.data))
            .catch(erro =>console.log(erro))    })
        .catch(err => alert('Đặt hàng thất bại'))
      }

      const isInList= (masp)=>{
            return sanpham.some(sp => sp.masp === masp)
      }
      const myEmail = 
      `<div>
                  <h4 className="text-secondary">Thông tin khách hàng</h4>
                    <hr/>
                        <table className="table table-borderless table-cart">
                            <tr>
                                <td>HỌ TÊN</td>
                                <td>${user.ho + ' ' + user.ten}</td>
                            </tr>
                            <tr>
                                <td>SỐ ĐIỆN THOẠI</td>
                                <td>${user.sdt}</td>
                            </tr>
                            <tr>
                                <td>EMAIL</td>
                                <td>${user.email}</td>
                            </tr>
                            <tr>
                                <td>ĐỊA CHỈ</td>
                                <td>${user.diachi}</td>
                            </tr>
                        </table>
                    <hr/>
                  <h4>Danh sách đơn hàng đang chờ xác nhận</h4>
                  <table>
                  ${cart.map(c=>{
                        if(isInList(c.sanpham.masp))
                        return`
                            <tr key={c.sanpham.masp}>
                                <td><img src=${c.sanpham.photo} alt="picture" style="width:100px;padding:5px 30px" /></td>
                                <td style="padding:5px 30px">${c.sanpham.tensp}</td>
                                <td style="padding:5px 30px">Số lượng : ${c.sanpham.soluong}</td>
                                <td style="padding:5px 30px">${c.sanpham.dongia * c.soluong} đ</td>
                            </tr>`
                        }
                    )}
                  </table>
                  <hr/>
              </div>`
    return (
        <div>
            <div className='banner'>
                <h3>GIỎ HÀNG</h3>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>               
                        <Detail_Portfolio />
                        <Detail_Portfolio />
                    </div>
                    <div className='col-8'>  
                        <h4 className="cart-header">DANH SÁCH GIỎ HÀNG</h4>            
                        <table className="table table-border table-cart">
                            {cart.map(c=>(
                                <tr key={c.sanpham.masp}>
                                    <td onClick={()=> deleteCart(c.sanpham.masp)} className="deleteCart">&#10005;</td>
                                    <td><img src={c.sanpham.photo} alt="picture" style={{width:"70px",marginRight:"30px"}} /> {c.sanpham.tensp}</td>
                                    <td style={{width:"15%"}}><input type="number" className="form-control" min="1" max={c.sanpham.soluong} defaultValue={c.soluong} onClick={(e)=>changeNum(e,c.sanpham)} /></td>
                                    <td><p className="text-danger">{c.sanpham.dongia * c.soluong} đ</p></td>
                                    <td><input type="checkbox" className="form-check-input" defaultChecked onClick={(e)=>checkSP(e,c.sanpham,c.soluong)}/></td>
                                </tr>
                            ))}
                        </table>
                        <div className="cart-hr"></div>
                        <div className="cart-total mt-4">
                            <p>Tổng sản phẩm :</p>
                            <p>{tongsp()}</p>
                        </div>
                        <div className="cart-total text-success">
                            <h4>Tạm tính :</h4>
                            <h4>{total} đ</h4>
                        </div>
                        
                        {sanpham.length>0?<button className="btn btn-success btn-lg mt-4" data-toggle="modal" data-target="#exampleModal">Đặt hàng</button>:''}
                          <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">TIẾN HÀNH ĐẶT HÀNG</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                      <p className="text-secondary">Thông tin khách hàng</p>
                                      <hr/>
                                        <table className="table table-borderless table-cart">
                                            <tr>
                                                <td>HỌ TÊN</td>
                                                <td>{user.ho + ' ' + user.ten}</td>
                                            </tr>
                                            <tr>
                                                <td>SỐ ĐIỆN THOẠI</td>
                                                <td>{user.sdt}</td>
                                            </tr>
                                            <tr>
                                                <td>EMAIL</td>
                                                <td>{user.email}</td>
                                            </tr>
                                            <tr>
                                                <td>ĐỊA CHỈ</td>
                                                <td>{user.diachi}</td>
                                            </tr>
                                        </table>
                                    <hr/>
                                    <p className="text-secondary">Danh sách sản phẩm</p>
                                    <hr/>
                                    <table className="table table-borderless table-cart">
                                        {cart.map(c=>{
                                            if(isInList(c.sanpham.masp))
                                            return(
                                                <tr key={c.sanpham.masp}>
                                                    <td><img src={c.sanpham.photo} alt="picture" style={{width:"70px",marginRight:"30px"}} /> {c.sanpham.tensp}</td>
                                                    <td style={{width:"15%"}}>Số lượng : {c.sanpham.soluong}</td>
                                                    <td className="text-danger">{c.sanpham.dongia * c.soluong} đ</td>
                                                </tr>)
                                            }
                                        )}
                                        <hr/>
                                        <tr>
                                            <td colSpan="2" style={{fontSize:"23px"}}>Tổng tiền</td>
                                            <td style={{fontSize:"23px"}}>{total} đ</td>
                                        </tr>
                                    </table>

                                  </div>
                                  <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Thoát</button>
                                    <button type="button" className="btn btn-primary" onClick={order} data-dismiss="modal">Xác nhận</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

