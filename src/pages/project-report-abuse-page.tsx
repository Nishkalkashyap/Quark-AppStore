import React, { Component, ChangeEvent } from 'react'
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { GenericFormData } from '../interfaces';
import GenericFormComponent from '../components/generic-form-component';
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import ReportIcon from '@material-ui/icons/Report'

const allAbuseCategories: StateType['reportReason'][] = ['Spam', 'Abuse', 'Off Topic']
interface StateType {
    reportReason: ('Spam' | 'Abuse' | 'Off Topic');
    subject: string;
    description: string;
}

class LocalComponent extends Component<basePropType> {

    constructor(props: basePropType) {
        super(props);
    }

    state: StateType = {
        reportReason: 'Abuse',
        subject: '',
        description: ''
    }

    onChange(event: ChangeEvent<{ name?: any, value: unknown }>) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(e : ChangeEvent) {
        e.preventDefault();
        console.log(this.state);
    }

    render() {

        const { reportReason, subject, description } = this.state;

        const isInvalid = subject.length == 0 || description.length == 0;

        const data: GenericFormData['data'] = {
            subject: {
                formData: {
                    label: "Subject",
                    type: "text",
                    required: true,
                    value: subject
                }
            },
            reportReason: {
                component: (
                    <FormControl variant="outlined" margin="normal">
                        <InputLabel>
                            Reason
                        </InputLabel>
                        <Select
                            value={reportReason}
                            onChange={this.onChange.bind(this)}
                            style={{ minWidth: '120px' }}
                            input={<OutlinedInput labelWidth={10} name="reportReason" />}
                        >
                            {
                                allAbuseCategories.map((cat) => (
                                    <MenuItem value={cat} key={cat}>{cat}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                )
            },
            description: {
                formData: {
                    label: "Description",
                    type: "text",
                    required: true,
                    value: description,

                    multiline: true,
                    rows: '4'
                }
            }
        }

        return (
            <GenericFormComponent
                headingText="Report abuse"
                icon={ReportIcon}
                isInvalid={isInvalid}
                onChange={this.onChange.bind(this)}
                onSubmit={this.onSubmit.bind(this)}
                submitButtonText="Submit"
                data={data}
            />
        )
    }
}

export const ProjectReportAbusePage = withAllProviders(LocalComponent);
