import { InstantSearch, SearchBox, Hits, RefinementList, Configure, Pagination, Stats, SortBy } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import React from 'react'
import { ProjectData, ProjectStats } from '../interfaces';
import { basePropType } from '../basePropType';
import { withAllProviders } from '../providers/all-providers';
import { SmallProjectCardComponent } from '../components/small-project-card-component';
import firebase from 'firebase';
import { Card, Typography, Container } from '@material-ui/core';
import { COLORS } from '../util';
import CardBgComponent from '../components/main-background-component';
import { orderBy } from 'lodash';

const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APPID!, process.env.REACT_APP_ALGOLIA_APIKEY!);
const searchIndexName = 'QUARK_DASHBOARD';

function LocalComponent(props: basePropType) {
    return (
        <Container maxWidth="lg">
            {/* <Card style={{ position: 'relative', margin: '20px 0px 40px 0px', padding: '20px 40px', background: 'transparent', color: COLORS.BACKGROUND }} elevation={4}>
                <CardBgComponent dotColor="#00000000" bgColor={COLORS.ON_PRIMARY} type="linear" />
                <div style={{ textAlign: 'center', margin: '80px 0px' }}>
                    <Typography variant="h2" component="h1" color="inherit">
                        Discover and share Quark projects
                    </Typography>
                    <Typography variant="h4" component="p" style={{ margin: '40px 0px' }}>
                        Find all the best community-made resources
                    </Typography>
                </div>
            </Card> */}
            <InstantSearch indexName={searchIndexName} searchClient={searchClient}>
                <SearchBox />
                <Stats />
                <Hits hitComponent={(__props) => <Hit baseProps={props} hit={__props.hit as any} />} />
                <Pagination />
            </InstantSearch>
        </Container>
    )
}

function Hit(props: { hit: ProjectData & { stats: ProjectStats }, baseProps: basePropType }) {
    console.log(props);
    props.hit.createdAt = firebase.firestore.Timestamp.fromMillis(getTime(props.hit.createdAt as any));
    props.hit.updatedAt = firebase.firestore.Timestamp.fromMillis(getTime(props.hit.updatedAt as any));
    return (
        <SmallProjectCardComponent isAlgoliaComponent={true} projectData={props.hit} {...props.baseProps} />
    );

    function getTime(time: { _seconds: number, _nanoseconds: number }) {
        const num = (time._seconds.toString().concat(time._nanoseconds.toString().substring(0, 3)));
        return num as any;
    }
}

export const AlgoliaInstantSearchPage = withAllProviders(LocalComponent);
