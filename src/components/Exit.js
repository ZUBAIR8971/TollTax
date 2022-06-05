import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Exit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EntryDateTime:"", 
            NumberPlate:"", 
            EntryInterchange:"",
            ExitDateTime: moment(new Date()).format('YYYY-MM-DD'), 
            ExitInterchange:"",
            TotalCostTrip: 0,
            TripStatus:"Completed",

            distanceCostBreakDown: 0,
            subTotal: 0,
            discount: 0,	
            baseRate: 0,

            recordID: "",
        }
    }

    componentDidMount() {
        
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    getTollsData = async () => {
        let header = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const { NumberPlate, ExitInterchange } = this.state;

        if( !NumberPlate || !ExitInterchange ){
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
                
            const carNumber = this.state.NumberPlate; 
            const carStatus = "Active";
    
            axios.get(`https://crudcrud.com/api/c491fce49735465f933b7d1f8c2ff813/trips`, header)
                .then((res) => {
    
                    const resData = res.data;
    
                    if(resData.length > 0){
                        if(resData.length > 1){
                            let filteresult = resData.filter(vehicle => {
                                return vehicle.NumberPlate === carNumber && vehicle.TripStatus === carStatus;
                            });
        
                            const _id = filteresult[0]._id;
                            const EntryPoint = filteresult[0].EntryInterchange;
                            const EntryDate = filteresult[0].EntryDateTime;
            
                            const data = { _id, EntryPoint, EntryDate };
            
                            this.totalTaxtoBeCharged(data); 
                        } else {
                            const _id = resData[0]._id;
                            const EntryPoint = resData[0].EntryInterchange;
                            const EntryDate = resData[0].EntryDateTime;
            
                            const data = { _id, EntryPoint, EntryDate };
    
                            this.totalTaxtoBeCharged(data); 
                        }
                    }
    
                })
                .catch(err => {
                    console.log(err);
                });
            }

        }

    };

    updateData = (record) => {
        let header = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const { NumberPlate, ExitDateTime, ExitInterchange, TripStatus } = this.state;

        const _id = record.recordID;
        const EntryDateTime = record.EntryDateTime;
        const EntryInterchange = record.EntryInterchange;
        const TotalCostTrip = record.TotalCostTripVal;

        const data = { EntryDateTime, NumberPlate, EntryInterchange, ExitDateTime, ExitInterchange, TotalCostTrip, TripStatus };

        axios.put(`https://crudcrud.com/api/c491fce49735465f933b7d1f8c2ff813/trips/${_id}`, data, header)
            .then((res) => {
                if(res.status === 201){
                    toast.success("Data Updated", {
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
                        ExitInterchange:"",
                        // TotalCostTrip: 0,
                        // distanceCostBreakDown: 0,
                        
                        // subTotal: 0,
                        // discount: 0,	
                        // baseRate: 0,

                        recordID: "",
                    })

                }
            })
              .catch(err => {
                  console.log(err);
              });
    }

    totalTaxtoBeCharged = (data) => {

        const EntryInterchange = data.EntryPoint;
        const EntryDateTime = data.EntryDate;
        const recordID = data._id;

        const { NumberPlate, ExitDateTime, ExitInterchange} = this.state;

        const baseRateVal = 20;

        const date = moment(ExitDateTime).format('MMMM DD');
        const exitDate = moment(ExitDateTime).format('dddd');

        const carNumber = NumberPlate.slice(4);

        let distanceCost = 0;
        let subTotalVal = 0;
        let discountVal = 0;	
        let TotalCostTripVal = 0;

        if(date === "March 23" || date === "August 14" || date === "December 25"){
            distanceCost = Math.round(this.costValue(EntryInterchange, ExitInterchange) * (0.2));
            subTotalVal = baseRateVal + distanceCost;

            if(carNumber % 2 === 0){
                discountVal = Math.round(subTotalVal * 0.5);
                TotalCostTripVal = subTotalVal - discountVal;
            }
        } else if(exitDate === "Saturday" || exitDate === "Sunday"){
            distanceCost = Math.round(this.costValue(EntryInterchange, ExitInterchange) * (0.2 * 1.5));
            subTotalVal = baseRateVal + distanceCost;
            discountVal = 0;
            TotalCostTripVal = subTotalVal;
        } else if(exitDate === "Monday" || exitDate === "Wednesday" ) {
            distanceCost = Math.round(this.costValue(EntryInterchange, ExitInterchange) * (0.2));
            subTotalVal = baseRateVal + distanceCost;

            if(carNumber % 2 === 0){
                discountVal = Math.round(subTotalVal * 0.1);
                TotalCostTripVal = subTotalVal - discountVal;
            }
        } else if(exitDate === "Tuesday" || exitDate === "Thursday") {

            distanceCost = Math.round(this.costValue(EntryInterchange, ExitInterchange) * (0.2));
            subTotalVal = baseRateVal + distanceCost;

            if(carNumber % 2 !== 0){
                discountVal = Math.round(subTotalVal * 0.1);
                TotalCostTripVal = subTotalVal - discountVal;
            } 
        } else {
            distanceCost = Math.round(this.costValue(EntryInterchange, ExitInterchange) * (0.2));
            subTotalVal = baseRateVal + distanceCost;
            discountVal = 0;
            TotalCostTripVal = subTotalVal;
        }

        this.setState({
            TotalCostTrip: TotalCostTripVal,
            distanceCostBreakDown: distanceCost,
            subTotal: subTotalVal,
            discount: discountVal,
            baseRate: baseRateVal,
        })

        const record = { EntryInterchange, EntryDateTime, recordID, TotalCostTripVal };

        this.updateData(record);

    }

    costValue = (EnInterchange, EXInterchange) => {
        const EntryInterchange = EnInterchange;
        const ExitInterchange = EXInterchange;

        let entryValue = 0;
        let exitValue = 0;

        if(EntryInterchange === "Zero point"){
            entryValue = 0;
        } else if(EntryInterchange === "NS Interchange"){
            entryValue = 5;
        } else if(EntryInterchange === "Ph4 Interchange"){
            entryValue = 10;
        } else if(EntryInterchange === "Ferozpur Interchange"){
            entryValue = 17;
        } else if(EntryInterchange === "Lake City Interchange"){
            entryValue = 24;
        } else if(EntryInterchange === "Raiwand Interchange"){
            entryValue = 29;
        } else if(EntryInterchange === "Bahria Interchange"){
            entryValue = 34;
        }

        if(ExitInterchange === "Zero point"){
            exitValue = 0;
        } else if(ExitInterchange === "NS Interchange"){
            exitValue = 5;
        } else if(ExitInterchange === "Ph4 Interchange"){
            exitValue = 10;
        } else if(ExitInterchange === "Ferozpur Interchange"){
            exitValue = 17;
        } else if(ExitInterchange === "Lake City Interchange"){
            exitValue = 24;
        } else if(ExitInterchange === "Raiwand Interchange"){
            exitValue = 29;
        } else if(ExitInterchange === "Bahria Interchange"){
            exitValue = 34;
        }

        const distanceCost = exitValue - entryValue;

        return distanceCost;
    }

    render() {
        return (
            <>
                <div className={'mainDiv'}>
                   <div className={'InnerDiv'}> 
                        <h3>Exit</h3>

                        <div className={'FlexDiv'}>

                            <div className={'InputDiv'}>
                                {/* <input type={'text'} placeholder={'Interchange'} name={'ExitInterchange'} id={'ExitInterchange'} value={this.state.ExitInterchange} onChange={this.handleChange} /> */}
                                <select name={'ExitInterchange'} id={'ExitInterchange'} value={this.state.ExitInterchange} defaultValue={this.state.ExitInterchange} onChange={this.handleChange}>
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
                                <input type={'date'} placeholder={'Data Time'} name={'ExitDateTime'} id={'ExitDateTime'} value={this.state.ExitDateTime} onChange={this.handleChange} />

                                <div className={'ButtonDiv'}>
                                    <button className={'Button'}
                                        onClick={this.getTollsData}>
                                            Calculate
                                    </button>
                                </div>
                            </div>

                            <div className={'InputSecondDiv'}>
                                <h4>Break Down of Cost</h4>
                                <div className={'CostDiv'}>
                                    <p>Base Rate: {this.state.baseRate}</p>
                                    <p>Distance Cost BreakDown: {this.state.distanceCostBreakDown}</p>
                                    <p>Sub-Total: {this.state.subTotal}</p>
                                    <p>Discount/Other: {this.state.discount}</p>
                                    <h6>Total TO BE CHARGED: {this.state.TotalCostTrip}</h6>
                                </div>
                            </div>
                        </div>
                   </div>
               </div>

               <ToastContainer transition={Zoom} />
            </>
        );
    }
}

export default Exit;