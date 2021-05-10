import React,{useState,useEffect,useContext} from 'react'
import firebase,{auth} from '../firebase'
import axios from 'axios'
const Register = ()=>{
    const [otp,setOtp] = useState();
    const [isSubmit,setIsSubmit] = useState(false);
    const [input,setInput] = useState({})
    const handleSubmit = (e)=>{
        e.preventDefault();
        axios.get(process.env.REACT_APP_API+'IsUserExits/'+ input.username)
        .then(response => {alert('Đã tồn tại username này !!!'); return})
        .catch(erro => {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'normal',
                'callback': (response) => {
                  // reCAPTCHA solved, allow signInWithPhoneNumber.
                      //setIsSubmit(true)
                      onVerify();
                 
                },
                'expired-callback':()=>{
                    //  window.recaptchaVerifier.clear(); 
                }
              });
            
              window.recaptchaVerifier.render();
        })
    }
    const onRegister = ()=>{

    }
    const onVerify= (recapcha)=>{
  
         const appVerifier = window.recaptchaVerifier
            let number = '+84'+ Number(input.sdt)
            auth.signInWithPhoneNumber(number,appVerifier)
            .then(e=>{
                let code = window.prompt('Nhập mã otp đã gửi');
                e.confirm(code)
                .then(res =>{
                    axios.post(process.env.REACT_APP_API +'register',input)
                    .then(response => window.alert('Đăng ký thành công'))
                    .catch(error => window.alert('Đăng ký thất bại'))
                })
                .catch(err=>{
                    window.alert('Đăng ký thất bại')
                })
            })
            //sendEmail();
           // window.appVerifier.clear()
          //  window.appVerifier.clear()
            
    }
    const sendEmail=()=>{
        let secretKey = Math.floor(Math.random() * 100000) + 1 //
        var actionCodeSettings = {
               
                // URL you want to redirect back to. The domain (www.example.com) for this
                // URL must be in the authorized domains list in the Firebase Console.
                url: 'https://hongquan-c16c6.web.app/'+'activate/',
                // This must be true.
                handleCodeInApp: true
              };
              firebase.auth().sendSignInLinkToEmail(input.email, actionCodeSettings)
                .then(() => {
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    window.localStorage.setItem('register',JSON.stringify(input));
                    // ...
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    console.log(`${errorCode} : ${errorMessage}`)
                });
    }
    const changeInput = (e)=>{

        const {name,value} = e.target;
        setInput({
            ...input,
            [name]:value
        })
    }
    return (
        <div className="container mt-4">
            {!isSubmit?
            <div className="card" style={{width: '100%'}}>
                <div className="card-header bg-success text-white">THÔNG TIN ĐĂNG KÝ TÀI KHOẢN</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <p>HỌ</p>
                    <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Nhập vào họ của bạn" name="ho" onChange={changeInput} />
                    <p>TÊN</p>
                    <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Nhập vào tên của bạn" name="ten" onChange={changeInput} />
                    <p>GIỚI TÍNH</p>
                    <select className="custom-select my-1 mr-sm-2" name="gioitinh" onChange={changeInput}>
                      <option value={1}>Nam</option>
                      <option value={0}>Nữ</option>
                    </select>
                    <p>SỐ ĐIỆN THOẠI</p>
                    <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Nhập số thoại thoại" name="sdt" onChange={changeInput}/>
                    <p>EMAIL</p>
                    <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Nhập vào email" name="email" onChange={changeInput}/>
                    <p>TÀI KHOẢN</p>
                    <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Nhập vào tài khoản" name="username" onChange={changeInput}/>
                    <p>MẬT KHẨU</p>
                    <input type="password" className="form-control mb-2 mr-sm-2" placeholder="Nhập vào mật khẩu" name="password" onChange={changeInput}/>
                    <p>ĐỊA CHỈ</p>
                    <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Nhập vào địa chỉ" name="diachi" onChange={changeInput}/>
                    <div id="recaptcha-container" className="mt-4 mb-4"></div>
                    <button type="submit" className="btn btn-success mr-4">ĐĂNG KÝ</button>
                    <button type="reset" className="btn btn-info">LÀM MỚI</button>
                </form>
              </div>
            </div>:
            <div>
                <h5>Xác thực OTP</h5>
                <div className="form-inline">
                <input type="text" className="form-control mr-2" placeholder="Nhập otp đã gửi" onChange={(e)=>setOtp(e.target.value)}/>
                <button className="btn btn-primary" type="button" onClick={onRegister}>Đăng ký</button>
            </div>
            </div>
            }
        </div>
    )
};

export default Register