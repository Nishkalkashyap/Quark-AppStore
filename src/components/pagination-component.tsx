import React, { Component } from 'react'
import { Container, Button, ButtonGroup, Card } from '@material-ui/core';
import { basePropType } from '../basePropType';
import { ROUTES } from '../data/routes';
import queryString from 'query-string';
import { handleFirebaseError, scrollToTop } from '../util';
import * as firebase from 'firebase';
import { progress } from './header-component';

export interface StateType<T> {
    paginationArray: T[],
    nextExists: boolean,
    previousExists: boolean,
}

export interface Pagination<T> {
    pagination: {
        getCollectionRef: (goingBackwards: boolean) => firebase.firestore.Query;
        getDocRef: () => firebase.firestore.DocumentReference;
        getRedirectRoute: (params: T) => string;
        loadLimit: number;
        isGroupQuery?: boolean,
        upperComponent?: any;
        // upperComponent: () => React.ComponentType<basePropType>;
        iteratorComponent?: any;
        // iteratorComponent: () => React.ComponentType<basePropType>;
    }
}


export class LocalPaginationComponent<T> extends Component<basePropType & Pagination<T>, Partial<StateType<T>>> {

    constructor(props: basePropType & Pagination<T>) {
        super(props);
    }

    state: StateType<T> = {
        paginationArray: [],
        nextExists: false,
        previousExists: false,
    }

    goingBackwards: boolean = false;

    componentDidMount() {
        this._setPaginationArray();
    }

    listeners: Function[] = [];
    paginationListeners: Function[] = [];
    nextAndPreviousListeners: Function[] = [];
    componentWillUnmount() {
        this.listeners.map((listener) => { listener() });
        this.paginationListeners.map((listener) => { listener() });
    };

    public _setPaginationArray() {
        this.paginationListeners.map((listener) => { listener() });//clear releaseListeners

        const values = queryString.parse(this.props.history.location.search);
        const startAfter = values['startAfter'];
        progress.showProgressBar();

        if (startAfter && typeof startAfter == 'string') {
            const topListener = this.props.firebase.getListenerForDocument(this.props.pagination.getDocRef(), (snap) => {

                if (!snap.exists && !this.props.pagination.isGroupQuery) {
                    this.props.history.push(ROUTES.NOT_FOUND);
                }

                const query = this.props.pagination.getCollectionRef(this.goingBackwards)
                    .startAfter(snap)
                    .limit(this.props.pagination.loadLimit);

                const subListener = this.props.firebase.getListenerForCollection(query, (subSnap) => {

                    if (subSnap.docs.length === 0) {
                        this.props.history.push(ROUTES.NOT_FOUND);
                    }

                    const arr = subSnap.docs.map((doc) => doc.data()) as T[];
                    const finalArr = this.goingBackwards ? arr.reverse() : arr;
                    scrollToTop();
                    this.setState({ paginationArray: finalArr });
                    this._fetchNextAndPreviousDocuments(finalArr, subSnap);
                    progress.hideProgressBar();
                })

                this.paginationListeners.push(subListener);
            });

            this.paginationListeners.push(topListener);
        } else {
            const query = this.props.pagination.getCollectionRef(false)
                .limit(this.props.pagination.loadLimit);

            this.paginationListeners.push(
                this.props.firebase.getListenerForCollection(query, (snap) => {
                    const arr = snap.docs.map((doc) => doc.data()) as T[];
                    const finalArr = arr;
                    scrollToTop();
                    this.setState({ paginationArray: finalArr });
                    this._fetchNextAndPreviousDocuments(arr, snap);
                    progress.hideProgressBar();
                })
            );
        }
    }

    private _fetchNextAndPreviousDocuments(paginationArray: T[], querySnapshot: firebase.firestore.QuerySnapshot) {
        this.nextAndPreviousListeners.map((listener) => listener());
        console.log(`Pagination array: ${paginationArray.length}`);

        if (!paginationArray.length) {
            const state: Partial<StateType<T>> = {
                nextExists: false,
                previousExists: false
            }
            this.setState(state);
            return;
        }

        const reverse = this.goingBackwards;
        let snap = querySnapshot!.docs;
        if (reverse) {
            snap = snap.reverse();
        }

        const nextDoc = snap[paginationArray.length - 1];
        const prevDoc = snap[0];

        const query1 = this.props.pagination.getCollectionRef(false).startAfter(nextDoc).limit(1);
        const subs1 = this.props.firebase.getListenerForCollection(query1, (snap) => {
            const nextExists = snap.docs[0] && snap.docs[0].exists;
            this.setState({ nextExists });
        });

        const query2 = this.props.pagination.getCollectionRef(true).startAfter(prevDoc).limit(1);
        const subs2 = this.props.firebase.getListenerForCollection(query2, (snap) => {
            const previousExists = snap.docs[0] && snap.docs[0].exists;
            this.setState({ previousExists });
            if (!previousExists) {
                const values = queryString.parse(this.props.history.location.search);
                delete values['startAfter'];

                const newString = queryString.stringify(values);
                if (newString.length) {
                    this.props.history.push(this.props.history.location.pathname.concat('?', newString));
                } else {
                    this.props.history.push(this.props.history.location.pathname);
                }
            }
        });

        this.nextAndPreviousListeners.push(subs1, subs2);
    }

    goToNextPage() {
        const { paginationArray } = this.state;
        if (paginationArray.length) {
            const index = paginationArray.length - 1;
            this.props.history.push(this.props.pagination.getRedirectRoute(paginationArray[index]));
            this.goingBackwards = false;
            setTimeout(() => {
                this._setPaginationArray();
            }, 10);
        }
    }

    goToPreviousPage() {
        const { paginationArray } = this.state;
        if (paginationArray.length) {
            const index = 0;
            this.props.history.push(this.props.pagination.getRedirectRoute(paginationArray[index]));
            this.goingBackwards = true;
            setTimeout(() => {
                this._setPaginationArray();
            }, 10);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container maxWidth="lg">
                    {this.props.pagination.upperComponent && <this.props.pagination.upperComponent state={this.state} />}
                    {this.props.pagination.iteratorComponent && <this.props.pagination.iteratorComponent state={this.state} />}
                </Container>
                <Container maxWidth="sm">
                    {(!this.state.paginationArray.length) &&
                        <blockquote>
                            No results found.
                        </blockquote>
                    }
                </Container>
                <Container maxWidth="sm" style={{ marginTop: '100px' }}>
                    <ButtonGroup
                        fullWidth
                        color="primary"
                        size="small"
                        aria-label="large outlined secondary button group"
                    >
                        <Button onClick={this.goToPreviousPage.bind(this)} disabled={!this.state.previousExists}>
                            Previous
                        </Button>
                        <Button onClick={this.goToNextPage.bind(this)} disabled={!this.state.nextExists}>
                            Next
                        </Button>
                    </ButtonGroup>
                </Container>
            </React.Fragment>
        )
    }
}

const PaginationComponent = (LocalPaginationComponent);
export { PaginationComponent }
