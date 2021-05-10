
import hoa from '../image/hoa4.jpg'
import quan from '../image/quan.jpg'
import './Detail_Product.css'
import React,{useState,useEffect,useContext} from 'react'
import ReactStars from "react-rating-stars-component";
import RateChart from './RateChart'
import {UserContext} from '../context/UserContext'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
  } from "react-router-dom";
import axios from 'axios'
function Detail_Product(){
    const [sl,setSl] = useContext(UserContext)
    let history = useHistory();
    let {masp} = useParams();
    const [soluong,setSoluong] = useState(1);
    const [sanpham,setSanpham] =useState();
    const [user,setUser] = useState({})
    const [danhgia,setDanhgia] = useState(false)
    const [rate,setRate] = useState()
    const [dgUser,setDgUser] = useState(0);
    const username = window.localStorage.getItem('username')
    const [cart,setCart] = useState([])
    useEffect(()=>{
        axios.get(process.env.REACT_APP_API+'sanpham/'+masp)
        .then(response => setSanpham(response.data) )
        .catch(erro => console.log(erro))

        if(username!=null){
            axios.get(process.env.REACT_APP_API +'khachhang/'+username,header)
            .then(response => {
                setUser(response.data )
                axios.get(process.env.REACT_APP_API+`giohang/${response.data.makh}`,header)
                .then(res => setCart(res.data))
                .catch(er=> console.log(er))

                axios.get(process.env.REACT_APP_API +'ctdh/'+response.data.makh+'/'+masp,header)
                .then(res => setDanhgia(res.data))
                .catch(err => console.log(err))

                

                axios.get(process.env.REACT_APP_API +'danhgia/'+ response.data.makh +'/'+masp)
                .then(res => setDgUser(res.data))
                .catch(err => console.log(err))
            })
            .catch(error => console.log(error))
        }
        axios.get(process.env.REACT_APP_API +'danhgia/'+masp)
                .then(res => setRate(res.data))
                .catch(err => console.log(err))
    },[])
    let myStorage = window.localStorage;
    const header = {
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('jwt') //the token is a variable which holds the token
        }
    }

    const getMaxSL = (masp)=>{
        let sl = 0;
        cart.forEach(c=>{
            if(c.sanpham?.masp === masp){
                sl = c.soluong;
            }
        })
        return sl;
    }
    const addCart = (masp)=>{
        console.log(masp + soluong)
        if(username == null){
        history.push('/login');
        }
        else{
        axios.post(process.env.REACT_APP_API+`giohang/${user.makh}/${masp}?soluong=${soluong}`,{},header)
        .then(Response => {
            alert('Thêm thành công !!!')
            axios.get(process.env.REACT_APP_API +'numcart/'+user.makh,header)
            .then(res => {setSl(res.data);window.location.reload();})
            .catch(err => console.log(err))
        })
        .catch(error => {alert('Thêm thất bại ' + error);console.log(error)})
        }
    }
    const ratingChanged = (newRating) => {
            const data ={
                id:{
                    masp:masp,
                    makh:user?.makh
                },
                khachhang:{
                    makh:user?.makh
                },
                sanpham:{
                    masp:masp
                },
                danhgia:newRating
            }
            axios.post(process.env.REACT_APP_API+`danhgia/`,data)
            .then(res => {
                axios.get(process.env.REACT_APP_API +'danhgia/'+masp)
                .then(res => setRate(res.data))
                .catch(err => console.log(err))
            })
            .catch(err =>console.log(err))

      };
    return (
        
        <div className="row detail_product">
            <div className="col-6">
                <img src={sanpham?.photo} alt="hoa picture" style={{width:"90%"}}/>
                {danhgia?
                    <div style={{marginTop:'40px'}}>
                        <h6 style={{fontSize:20}}>Đánh giá sản phẩm</h6>
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={30}
                            value={dgUser}
                            emptyIcon={<i className="far fa-star"></i>}
                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                            fullIcon={<i className="fa fa-star"></i>}
                            activeColor="#ffd700"
                        />
                        
                    </div>    :''
                  }
            </div>
            <div className="col-6">
                <h3>{sanpham?.tensp}</h3>
                <h4 className="text-danger">{sanpham?.dongia} $</h4>
                <hr/>
                <div className="row">
                    <div className="col-6">
                        <p>Danh mục</p>
                    </div>
                    <div className="col-6 text-right">
                        <p>{sanpham?.danhmuc?.madm}</p>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-6">
                        <p>Mô tả ngắn</p>
                    </div>
                    <div className="col-6 text-right">
                        <p>{sanpham?.mota_ngan}</p>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-6">
                        <p>Hàng trong kho</p>
                    </div>
                    <div className="col-6 text-right">
                        {sanpham?.soluong != 0?<p>Còn : {sanpham?.soluong}</p>:<p>Hết hàng</p>}
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-6">
                        <input type="number" className="form-control" min="1" defaultValue="1" max={sanpham?.soluong - getMaxSL(sanpham?.masp)} disabled={sanpham?.soluong == 0 || (sanpham?.soluong - getMaxSL(sanpham?.masp))<=0} onChange={(e)=>{setSoluong(e.target.value)}} />
                    </div>
                    <div className="col-6">
                        <button disabled={sanpham?.soluong == 0 || (sanpham?.soluong - getMaxSL(sanpham?.masp))<=0} className="btn btn-success" onClick={()=>addCart(sanpham.masp)}><i className="fa fa-shopping-cart" aria-hidden="true"></i> Add to card</button>
                    </div>
                </div>
            </div>
            <div className='col-12'>
                    <RateChart 
                            key={masp}
                            five = {rate?.five}
                            one = {rate?.one}
                            two = {rate?.two}
                            three = {rate?.three}
                            four = {rate?.four}
                            
                            soluong = {rate?.soluong}
                        />
            </div>
            <div className="col-12 toggle-nav">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#home">Chi tiết</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#menu1">Thông tin thanh toán</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#menu2">Đánh giá khách hàng</a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane container active" id="home">{sanpham?.mota_chitiet}</div>
                    <div className="tab-pane container fade" id="menu1">Sacombank Hongquan 0040232232</div>
                    <div className="tab-pane container fade" id="menu2">
                        <div className="row">
                            <div className="col-12 mb-4">
                                {/* <p>0 Bình luận</p>
                                <hr></hr> */}
                                <div class="fb-comments" data-href={"https://localhost:8080/"+masp} data-width="" data-numposts="5"></div>
                            </div>
                            {/* <div className="col-2 mt-4">
                                <img src={quan} alt="picture" style={{width:"90%"}} className="rounded-circle"/>
                            </div>
                            <div className="col-10 mt-4">
                                <textarea className="form-control" rows="4" placeholder="Để lại bình luận của bạn !!!"></textarea>
                            </div> */}
                        </div>
                    </div>
                </div>
              </div>
         </div>
    )
}

export default Detail_Product;