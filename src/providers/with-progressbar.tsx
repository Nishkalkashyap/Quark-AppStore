import React from 'react';
import { LinearProgress } from '@material-ui/core';

export const withProgress = (Component: any) => {
    class ProgressBar extends React.Component {

        _show: boolean = false;

        show() {
            console.log('Show called');
            if (this._show === true) {
                return;
            }
            this._show = true;
            this.forceUpdate();
        }

        hide() {
            console.log('Hide called');
            if (this._show === false) {
                return;
            }
            this._show = false;
            this.forceUpdate();
        }

        render() {
            return (<React.Fragment>
                {this._show && <LinearProgress color="secondary" />}
                <Component {...this.props} progress={{ show: this.show.bind(this), hide: this.hide.bind(this) }} />
            </React.Fragment>)
        }
    }


    return ProgressBar;
}