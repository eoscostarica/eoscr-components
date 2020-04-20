import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import IconButton from '@material-ui/core/IconButton'
import ReCAPTCHA from 'react-google-recaptcha'

import eosjsAPI from './api/eosjs-api'
import config from './config'

const useStyles = makeStyles(theme => ({
  root: {
    height: 'auto',
    display: 'flex',
    padding: '0 10px'
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 10,
    width: '100%',
    height: 'auto',
    '&:focus': {
      outline: 'none'
    },
    [theme.breakpoints.up('sm')]: {
    width: '60%'
    }
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '60%',
    justifyContent: 'space-between'
  },
  deleteBtn: {
    height: 27,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  iconBtnPadding: {
    padding: 0
  },
  captcha: {
    marginTop: 10
  }
}))

const DEFAULT_MESSAGE = 'This field is required'
const INITIAL_VALUES = {
  accountName: {
    value: '',
    error: '',
    isRequired: true,
    isValid: false
  },
  ownerPK: {
    value: '',
    error: '',
    isRequired: true,
    isValid: false
  },
  activePK: {
    value: '',
    error: '',
    isRequired: true,
    isValid: false
  }
}

const CreateAccount = ({ onHandleSubmit, customBtnStyle }) => {
  const classes = useStyles()
  const [values, setValues] = useState(INITIAL_VALUES)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  console.log({ eosjsAPI })

  const handleOnSubmit = () => {
    if (
      values.accountName.isValid &&
      values.activePK.isValid &&
      values.ownerPK.isValid
    ) {
      // await api.transact({
      //   actions: [{
      //     account: 'eosio',
      //     name: 'newaccount',
      //     authorization: [{
      //       actor: 'useraaaaaaaa',
      //       permission: 'active',
      //     }],
      //     data: {
      //       creator: 'useraaaaaaaa',
      //       name: values.accountName,
      //       owner: {
      //         threshold: 1,
      //         keys: [{
      //           key: values.ownerPK,
      //           weight: 1
      //         }],
      //         accounts: [],
      //         waits: []
      //       },
      //       active: {
      //         threshold: 1,
      //         keys: [{
      //           key: values.activePK,
      //           weight: 1
      //         }],
      //         accounts: [],
      //         waits: []
      //       },
      //     },
      //   },
      //   {
      //     account: 'eosio',
      //     name: 'buyrambytes',
      //     authorization: [{
      //       actor: 'useraaaaaaaa',
      //       permission: 'active',
      //     }],
      //     data: {
      //       payer: 'useraaaaaaaa',
      //       receiver: values.accountName,
      //       bytes: 8192,
      //     },
      //   },
      //   {
      //     account: 'eosio',
      //     name: 'delegatebw',
      //     authorization: [{
      //       actor: 'useraaaaaaaa',
      //       permission: 'active',
      //     }],
      //     data: {
      //       from: 'useraaaaaaaa',
      //       receiver: values.accountName,
      //       stake_net_quantity: '1.0000 SYS',
      //       stake_cpu_quantity: '1.0000 SYS',
      //       transfer: false,
      //     }
      //   }]
      // }, {
      //   blocksBehind: 3,
      //   expireSeconds: 30,
      // });

      onHandleSubmit({
        accountName: values.accountName.value,
        ownerPK: values.activePK.value,
        activePK: values.ownerPK.value
      })

      setValues(INITIAL_VALUES)

      return
    }

    setValues({
      accountName: {
        ...values.accountName,
        error: !values.accountName.value.length ? DEFAULT_MESSAGE : ''
      },
      ownerPK: {
        ...values.ownerPK,
        error: !values.activePK.value.length ? DEFAULT_MESSAGE : ''
      },
      activePK: {
        ...values.activePK,
        error: !values.ownerPK.value.length ? DEFAULT_MESSAGE : ''
      }
    })
  }

  const handleChange = event => {
    event.preventDefault()
    const { name, value } = event.target
    const regexValidation = {
      accountName: /^[a-zA-Z1-5]{12}/,
      eosKey: /^\bEOS[a-zA-Z0-9]+$/
    }
    let error = ''
    let isValid = false

    switch (name) {
      case 'accountName':
        if (!regexValidation.accountName.test(value)) {
          error = 'a-z,1-5 are allowed only. Length 12'
        } else {
          error = ''
          isValid = true
        }
        break
      case 'ownerPK':
        if (!regexValidation.accountName.test(value)) {
          error = 'Owner Public Key format is not valid!'
        } else {
          error = ''
          isValid = true
        }
        break
      case 'activePK':
        if (!regexValidation.accountName.test(value)) {
          error = 'Public Public Key format is not valid!'
        } else {
          error = ''
          isValid = true
        }
        break
      default:
        break
    }

    setValues({
      ...values,
      [name]: { isRequired: true, value, error, isValid }
    })
  }

  return (
    <div>
      <Button
        size='large'
        color='secondary'
        onClick={handleOpen}
        className={customBtnStyle}
      >
        Create account
      </Button>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <div className={classes.paper}>
          <form noValidate autoComplete='off'>
            <Grid
              direction='column'
              spacing={1}
              justify='space-between'
              className={classes.root}
            >
              <div className={classes.inputBox}>
                <div className={classes.deleteBtn}>
                  <IconButton
                    classes={{ root: classes.iconBtnPadding }}
                    aria-label='delete'
                    onClick={() => setOpen(false)}
                  >
                    X
                  </IconButton>
                </div>
                <Grid item>
                  <TextField
                    fullWidth
                    error={Boolean(values.accountName.error)}
                    helperText={
                      values.accountName.error ? values.accountName.error : ''
                    }
                    label='Account Name'
                    placeholder='eoscrtest123'
                    required
                    autoComplete='off'
                    name='accountName'
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    error={Boolean(values.ownerPK.error)}
                    helperText={
                      values.ownerPK.error ? values.ownerPK.error : ''
                    }
                    label='Owner Public Key'
                    placeholder='EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
                    required
                    autoComplete='off'
                    name='ownerPK'
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    error={Boolean(values.activePK.error)}
                    helperText={
                      values.activePK.error ? values.activePK.error : ''
                    }
                    label='Active Public Key'
                    placeholder='EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
                    required
                    autoComplete='off'
                    name='activePK'
                    onChange={handleChange}
                  />
                </Grid>
                <div className={classes.captcha}>
                  <ReCAPTCHA sitekey={config.sitekey} onChange={(value) => console.log({ value })} />
                </div>
              </div>
              <div className={classes.btn}>
                <Button
                  size='large'
                  variant='contained'
                  color='primary'
                  onClick={handleOnSubmit}
                >
                  Create account
                </Button>
              </div>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  )
}

CreateAccount.propTypes = {
  onHandleSubmit: PropTypes.func,
  customBtnStyle: PropTypes.object
}

CreateAccount.defaultProps = {
  onHandleSubmit: () => console.log('click Submit button'),
  customBtnStyle: {}
}

export default CreateAccount
