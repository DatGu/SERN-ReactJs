import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './DoctorManage.scss'
import 'react-image-lightbox/style.css';
import { FormattedMessage } from 'react-intl';
import Header from '../../Header/Header';
import { connect } from 'react-redux';
import { userService } from '../../../services'
import { languages, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions'
import * as ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { result } from 'lodash';

const mdParser = new MarkdownIt();
class DoctorManage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            contentMarkdown: '',
            contentHTMLMarkdown: '',
            selectedOption: null,
            description: '',
            arrDoctors: []
        }
    }
    async componentDidMount() {
        this.props.getDoctorsStart()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.doctors !== this.props.doctors) {
            let listDoctors = this.arrDoctorToSelectOption(this.props.doctors)
            this.setState({
                arrDoctors: listDoctors,
            })
        }
        if (prevProps.language !== this.props.language) {
            let listDoctors = this.arrDoctorToSelectOption(this.props.doctors)
            this.setState({
                arrDoctors: listDoctors,
            })
        }
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTMLMarkdown: html
        });
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
    };
    handleOnChangeDecs = (event) => {
        this.setState({
            description: event.target.value
        })
    }
    handleOnClickSaveChange = () => {
        this.props.saveInfoDoctor({
            contentMarkdown: this.state.contentMarkdown,
            contentHTML: this.state.contentHTMLMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
        })
        this.setState({
            description: '',
            selectedOption: null,
        })
        alert("Saved Info Doctor")
    }
    arrDoctorToSelectOption = (arrDoctors) => {
        let options = []
        let { language } = this.props
        if (arrDoctors && arrDoctors.length > 0) {
            arrDoctors.map((item, index) => {
                let object = {}
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = language == 'vi' ? labelVi : labelEn
                object.value = item.id
                options.push(object)
            })
        }
        return options
    }
    render() {
        //const { selectedOption } = this.state;
        return (
            <div className='manage-doctor-container'>
                <Header />
                <div className='title'>Manage Doctor</div>
                <div className='select-texarea'>
                    <div className='select-doctor'>
                        <p className='title-choose-doctor'>Ch???n b??c s??</p>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.state.arrDoctors}
                        />
                    </div>
                    <div className='textarea'>
                        <p className='intro-doctor'>Th??ng tin gi???i thi???u</p>
                        <textarea rows='5' className='textarea-doctor form-control'
                            onChange={(event) => this.handleOnChangeDecs(event)}
                            value={this.state.description}></textarea>
                    </div>

                </div>
                <MdEditor style={{ height: '500px', marginTop: '100px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} />
                <Button style={{ marginLeft: '50px', marginTop: '20px', backgroundColor: 'rgb(0 115 186)' }}
                    onClick={() => this.handleOnClickSaveChange()}
                >Save Change</Button>
            </div >
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        doctors: state.admin.doctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveInfoDoctor: (data) => dispatch(actions.saveInfoDoctorStart(data)),
        getDoctorsStart: () => dispatch(actions.fetchAllDoctorsStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
