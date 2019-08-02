import React, { Component, ChangeEvent } from 'react'
import { PaginationComponent, Pagination, StateType, LocalPaginationComponent } from '../components/pagination-component';
import { basePropType } from '../basePropType';
import { getProjectDocPath } from '../data/paths';
import { ROUTES } from '../data/routes';
import queryString from 'query-string';
import { SmallProjectCardComponent, smallProjectContainerStyles } from '../components/small-project-card-component';
import { withAllProviders } from '../providers/all-providers';
import { ProjectData, allCategories } from '../interfaces';
import { Typography, Card, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import MainBgComponent, { MainBgContainerStyles } from '../components/main-background-component';
import { allProjectCategories } from '../util';

type PaginationType = ProjectData;
type LocalStateType = {
    category: allCategories | null
}

export class LocalComponent extends Component<basePropType & { classes: any }, LocalStateType> {
    firestore = this.props.firebase.firestore;
    child: React.RefObject<LocalPaginationComponent<ProjectData>>;

    constructor(props: basePropType & { classes: any }) {
        super(props);
        this.child = React.createRef();
        this.state.category = queryString.parse(this.props.history.location.search)['category'] as any;
    }

    state = {
        category: null
    }

    onChange(e: ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
        if (this.state.category !== e.target.value as any) {
            this.props.history.push(`${ROUTES.DASHBOARD_PAGE}?category=${e.target.value}`);
            this.setState({ category: e.target.value as any });
            setTimeout(() => {
                this.child.current!._setPaginationArray();
            }, 100);
        }
    }

    pagination: Pagination<PaginationType> = {
        pagination: {
            isGroupQuery: true,
            getCollectionRef: () => {
                console.log(this.state.category);
                return (() => {
                    if (this.state.category) {
                        return this.firestore.collectionGroup('projects').where('category', '==', this.state.category!)
                    }
                    return this.firestore.collectionGroup('projects');
                })();
            },
            getDocRef: () => {
                return this.firestore.doc(getProjectDocPath(this.props.urlProjectId || this.props.firebase.auth.currentUser!.uid, queryString.parse(this.props.history.location.search)['startAfter'] as string))
            },
            getRedirectRoute: (params) => {
                if (this.state.category) {
                    return `${ROUTES.DASHBOARD_PAGE}?category=${this.state.category}&startAfter=${params.projectId}`
                }
                return `${ROUTES.DASHBOARD_PAGE}?startAfter=${params.projectId}`
            },
            loadLimit: 20,
            upperComponent: () => {
                return (
                    <Card style={Object.assign({ marginBottom: '100px' }, MainBgContainerStyles)} elevation={4}>
                        <MainBgComponent />
                        <div style={{ textAlign: 'center', margin: '80px 0px' }}>
                            <Typography variant="h2" component="h1" color="inherit">
                                Discover and share Quark projects
                            </Typography>
                            <Typography variant="body1" component="p" style={{ margin: '40px 0px' }}>
                                Find all the best community-made resources
                            </Typography>
                        </div>
                        <div>
                            <FormControl variant="outlined" margin="normal">
                                <InputLabel>
                                    Category
                                </InputLabel>
                                <Select
                                    value={this.state.category || ''}
                                    onChange={this.onChange.bind(this)}
                                    style={{ minWidth: '120px' }}
                                    input={<OutlinedInput labelWidth={10} name="category" />}
                                >
                                    {
                                        allProjectCategories.map((cat) => (
                                            <MenuItem value={cat} key={cat}>{cat}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </Card>
                )
            },
            iteratorComponent: (data: { state: StateType<PaginationType> }) => (
                <div style={smallProjectContainerStyles}>
                    {data.state.paginationArray.map((arr) => {
                        return (
                            <SmallProjectCardComponent key={arr.projectId} {...this.props} projectData={arr} />
                        )
                    })}
                </div>
            )
        }
    }

    render() {
        return (
            <PaginationComponent
                {...this.props}
                {...this.pagination}
                ref={this.child}
            />
        )
    }
}

const BrowseProjectsPage = (withAllProviders(LocalComponent));
export { BrowseProjectsPage }

