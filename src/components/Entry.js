import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EntryDateTime:moment(new Date()).format('YYYY-MM-DD'), 
            NumberPlate:"", 
            EntryInterchange:"",
            ExitDateTime:"", 
            ExitInterchange:"",
            TotalCostTrip: 0,
            TripStatus:"Active",

            distanceCostBreakDown: 0,
            subTotal: 0,
            discount: 0,	
            baseRate: 0,
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    SubmitData = (event) => {
        let header = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        event.preventDefault();

        const { EntryDateTime, NumberPlate, EntryInterchange, ExitDateTime, ExitInterchange, TotalCostTrip, TripStatus } = this.state;

        if( !NumberPlate || !EntryInterchange ){
            toast.error('Please fill all the fields', {
                toastId: "toastAvoidsDuplicates",
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {

            const plateReg = /^[a-zA-Z]{3}[-][0-9]{3}$/;
            if( plateReg.test(this.state.NumberPlate) === false ){
                toast.error('NumberPlate format is Incorrect. Correct format is abc-111', {
                    toastId: "toastAvoidsDuplicates",
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,    
                });
            } else {
                const data = { EntryDateTime, NumberPlate, EntryInterchange, ExitDateTime, ExitInterchange, TotalCostTrip, TripStatus };

                axios.post(`https://crudcrud.com/api/c491fce49735465f933b7d1f8c2ff813/trips`, data, header)
                    .then((res) => {
                        if(res.status === 201){
                            toast.success("Data Submit", {
                                toastId: "toastAvoidsDuplicates",
                                position: "top-center",
                                autoClose: 2000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
        
                            this.setState({
                                NumberPlate:"", 
                                EntryInterchange:"",
                            })
        
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }

    }

    render() {
        return (
            <>
               <div className={'mainDiv'}>
                   <div className={'InnerDiv'}>
                        <h3>Entry</h3>

                       <div className={'InputDiv'}>
                            {/* <input type={'text'} placeholder={'Interchange'} name={'EntryInterchange'} id={'EntryInterchange'} value={this.state.EntryInterchange} onChange={this.handleChange} /> */}
                            <select name={'EntryInterchange'} id={'EntryInterchange'} value={this.state.EntryInterchange} defaultValue={this.state.EntryInterchange} onChange={this.handleChange}>
                                    <option value="">Interchange</option>
                                    <option value="Zero point">Zero point</option>
                                    <option value="NS Interchange">NS Interchange</option>
                                    <option value="Ph4 Interchange">Ph4 Interchange</option>
                                    <option value="Ferozpur Interchange">Ferozpur Interchange</option>
                                    <option value="Lake City Interchange">Lake City Interchange</option>
                                    <option value="Raiwand Interchange">Raiwand Interchange</option>
                                    <option value="Bahria Interchange">Bahria Interchange</option>
                                </select>
                            <input type={'text'} placeholder={'Number-Plate'} name={'NumberPlate'} id={'NumberPlate'} value={this.state.NumberPlate} onChange={this.handleChange} />
                            <input type={'date'} placeholder={'Data Time'} name={'EntryDateTime'} id={'EntryDateTime'} value={this.state.EntryDateTime} onChange={this.handleChange} />
                       </div>
                          <div className={'ButtonDiv'}>
                            <button className={'Button'}
                              onClick={this.SubmitData}>
                                Submit
                            </button>
                        </div>
                   </div>
               </div>

               <ToastContainer transition={Zoom} />
            </>
        );
    }
}

export default Entry;