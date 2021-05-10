import React from 'react'
import ReactStars from "react-rating-stars-component";
const RateChart = (props)=>{
    return (
        <div style={{marginTop:50, marginBottom:30}}>
            <h5>THỐNG KÊ ĐÁNH GIÁ</h5>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <div className="row align-items-center">
                    <div className="col-12 mb-2">
                        <h6>Số lượng đánh giá : {props.soluong}</h6>
                    </div>
                    <div className="col-1 text-left">
                        5 <i className="fa fa-star" aria-hidden="true" style={{color:"#ffd700"}}></i>
                    </div>
                    <div className="col-11">
                        <div className="progress">
                            
                          <div className="progress-bar bg-success" role="progressbar" style={{width: props.five+'%'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}> {props.five} %</div>
                        </div>
                        
                    </div>

                    <div className="col-1 text-left">
                        4 <i className="fa fa-star" aria-hidden="true" style={{color:"#ffd700"}}></i>
                    </div>
                    <div className="col-11">
                        <div className="progress">
                          <div className="progress-bar bg-success" role="progressbar" style={{width: props.four+'%'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>{props.four} %</div>
                        </div>
                        
                    </div>

                    <div className="col-1 text-left">
                        3 <i className="fa fa-star" aria-hidden="true" style={{color:"#ffd700"}}></i>
                    </div>
                    <div className="col-11">
                        <div className="progress">
                          <div className="progress-bar bg-success" role="progressbar" style={{width: props.three+'%'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>{props.three} %</div>
                        </div>
                        
                    </div>

                    <div className="col-1 text-left">
                        2 <i className="fa fa-star" aria-hidden="true" style={{color:"#ffd700"}}></i>
                    </div>
                    <div className="col-11">
                        <div className="progress">
                          <div className="progress-bar bg-success" role="progressbar" style={{width: props.two+'%'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>{props.two} %</div>
                        </div>
                        
                    </div>

                    <div className="col-1 text-left">
                        1 <i className="fa fa-star" aria-hidden="true" style={{color:"#ffd700"}}></i>
                    </div>
                    <div className="col-11">
                        <div className="progress">
                          <div className="progress-bar bg-success" role="progressbar"   style={{width: props.one+'%'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>{props.one} %</div>
                        </div>
                        
                    </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RateChart