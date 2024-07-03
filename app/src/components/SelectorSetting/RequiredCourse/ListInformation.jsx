import React, {Component} from "react";
import {Card, Button, Form, InputGroup, Row, Col} from "react-bootstrap";
import styled from "styled-components";
import {websiteColor} from "../../../config";

const StyledSelect = styled(Form.Select)`
    margin-right: 10px;
    width: auto;

    &:last-child {
        margin-right: 0;
    }
`;

const StyledButton = styled(Button)`
    margin-left: auto;
    background-color: ${websiteColor.mainColor};
    border-color: ${websiteColor.mainColor};

    &:hover {
        background-color: ${websiteColor.mainDarkerColor};
        border-color: ${websiteColor.mainDarkerColor};
    }
`;

const ButtonsRow = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
`;

class ListInformation extends Component {
    handleSelectDepartment = (e) => {
        this.props.onRequiredCourseFilterChange({"Department": e.target.value});
    };

    handleSelectGrade = (e) => {
        this.props.onRequiredCourseFilterChange({"Grade": e.target.value});
    };

    handleSelectClass = (e) => {
        this.props.onRequiredCourseFilterChange({"Class": e.target.value});
    };

    /**
     * 處理全部填入
     */
    handleSelectAll = () => {
        this.props.filteredCourses.forEach(course => {
            this.props.onCourseSelect(course, true);
        });
    };

    /**
     * 處理全部取消
     */
    handleDeselectAll = () => {
        this.props.filteredCourses.forEach(course => {
            this.props.onCourseSelect(course, false);
        });
    };

    render() {
        const {
            selectedCourses,
            calculateTotalCreditsAndHours,
            filterOptions,
            requiredCourseFilters,
        } = this.props;
        const {totalCredits, totalHours} = calculateTotalCreditsAndHours(selectedCourses);

        return (
            <Card.Body>
                <Row>
                    <Col lg={4} md={4} sm={12} xs={12} className="mb-2">
                        <StyledSelect
                            id="required-course-department"
                            className="w-100"
                            onChange={this.handleSelectDepartment}
                            value={requiredCourseFilters['Department']}
                        >
                            <option value="">選擇系所</option>
                            {filterOptions['系所'].options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </StyledSelect>
                    </Col>
                    <Col lg={4} md={4} sm={6} xs={6} className="mb-2">
                        <StyledSelect
                            id="required-course-grade"
                            onChange={this.handleSelectGrade}
                            value={requiredCourseFilters['Grade']}
                            className="w-100"
                        >
                            <option value="">年級 (全)</option>
                            {filterOptions['年級'].options.map((option, index) => (
                                <option key={index}
                                        value={option}>{filterOptions['年級'].optionDisplayName[index]}</option>
                            ))}
                        </StyledSelect>
                    </Col>
                    <Col lg={4} md={4} sm={6} xs={6} className="mb-2">
                        <StyledSelect
                            id="required-course-class"
                            onChange={this.handleSelectClass}
                            value={requiredCourseFilters['Class']}
                            className="w-100"
                        >
                            <option value="">班級 (全)</option>
                            {filterOptions['班別'].options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </StyledSelect>
                    </Col>
                </Row>
                <ButtonsRow>
                    <InputGroup className="w-auto">
                        <InputGroup.Text>{totalCredits} 學分</InputGroup.Text>
                        <InputGroup.Text>{totalHours} 小時</InputGroup.Text>
                    </InputGroup>
                    <StyledButton
                        variant="success"
                        onClick={this.handleSelectAll}
                        disabled={requiredCourseFilters['Department'] === ""}
                    >
                        全填
                    </StyledButton>
                    <Button
                        variant="danger"
                        className="ms-2"
                        onClick={this.handleDeselectAll}
                        disabled={requiredCourseFilters['Department'] === ""}
                    >
                        全取消
                    </Button>
                </ButtonsRow>
            </Card.Body>
        );
    }
}

export default ListInformation;
