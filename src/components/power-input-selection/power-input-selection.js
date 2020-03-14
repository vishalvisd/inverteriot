import React from 'react';
import Switch from '@material-ui/core/Switch';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import _ from 'lodash';
import setInstruction from '../../api/setInstruction';

const AntSwitch = withStyles(theme => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

const styles = theme => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    paper: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
});

const setAllValueToFalse = obj => {
    _.keys(obj).forEach(k=>{
        obj[k] = false;
    });
    return obj;
};

const getInsFromName = name => {
    return _.get(_.split(name, 'checked'), '[1]');
};

const getSnackbarErrorMessages = (erros) => {
    let errorString = '';
    _.forEach(erros, e => {
        errorString += `${e} \n`;
    });
    return errorString;
};

class PowerInputSelection extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            switchState: {
                checked00: false,
                checked01: false,
                checked10: false,
                checked11: false
            },
            switchStateMessage: {
                checked00: "Direct",
                checked01: "Solar Only",
                checked10: "Battery Charging BUT powerd by mains",
                checked11: "Normal Inverter Mode"
            },
            errors: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = name => event => {
        const isChecked = event.target.checked;
        //user shouldn't be able to just switch off a switch, one switch has to be on on after initialization
        if (isChecked === false && this.state[name] === true){
            return;
        }
        setInstruction(getInsFromName(name)).then(({data, isError, errors})=>{
            const state = _.assign({}, this.state);
            if (isError === false){
                setAllValueToFalse(state.switchState);
                state.switchState[name] = isChecked;
                state.errors = [];
            } else {
                state.errors = errors;
            }
            this.setState(state);
        });
    };

    render() {
        const { classes } = this.props;
        return <div>
            <div className={classes.root}>
                {
                    _.map(_.keys(this.state.switchState), k => {
                        return <Paper key={k} className={classes.paper}>
                            <Grid container wrap="nowrap" spacing={2}>
                                <Grid item xs zeroMinWidth>
                                    <Typography noWrap>{this.state.switchStateMessage[k]}</Typography>
                                </Grid>
                                <Grid item>
                                    <AntSwitch
                                        checked={this.state.switchState[k]}
                                        onChange={this.handleChange(k)}
                                        value={k}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    })
                }
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.errors.length > 0}
                autoHideDuration={6000}
                message={getSnackbarErrorMessages(this.state.errors)}
            />
        </div>
    }
}

export default withStyles(styles)(PowerInputSelection);