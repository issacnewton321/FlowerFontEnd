import React from 'react'
import Detail_Portfolio from './Detail_Portfolio'
import Detail_Product from './Detail_Product'
import './Detail.css'
export default function Detail(){
    return(
        <div>
            <div className='banner'>
                <h3>Hoa hồng có gai</h3>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>               
                        <Detail_Portfolio />
                        <Detail_Portfolio />
                    </div>
                    <div className='col-8'>               
                        <Detail_Product />
                    </div>
                </div>
            </div>
        </div>
    )
}