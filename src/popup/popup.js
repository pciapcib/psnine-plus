import { h, render, Component } from 'preact'
import R from 'ramda'

import {
  SERVICES,
  DEFAULT_SERVICES,
  LIST_SERVICES,
  DEFAULT_LIST_SERVICES
} from '../constants'

class PsninePlusPopup extends Component {
  state = {
    ...DEFAULT_SERVICES,
    ...DEFAULT_LIST_SERVICES
  }

  storage = {}

  constructor (props) {
    super(props)

    chrome.runtime.onMessage.addListener(this.handleMessage)
  }

  componentDidMount () {
    chrome.runtime.sendMessage({
      type: 'openPopup'
    })
  }

  handleMessage = ({ type, data }) => {
    switch (type) {
      case 'getConfig':
        this.setState({ ...data })
        this.storage = data

        break
    }
  }

  makeCheckbox = (services, serviceName) => (
    <label key={serviceName} className='psnine-plus-popup-checkbox'>
      <input
        type='checkbox'
        name={serviceName}
        checked={this.state[serviceName]}
        onChange={this.handleConfigChange}
      />
      {services[serviceName]}
    </label>
  )

  makeTextarea = (services, serviceName) => (
    <label key={`${serviceName}-list`} className='psnine-plus-popup-textarea'>
      <textarea
        rows={5}
        cols={15}
        name={`${serviceName}List`}
        value={this.state[`${serviceName}List`].join('\n')}
        onChange={this.handleListChange}
      />
    </label>
  )

  handleConfigChange = e => {
    const name = e.target.name
    const value = e.target.checked

    this.setState({
      [name]: value
    })
  }

  handleListChange = e => {
    const name = e.target.name
    const value = e.target.value ? e.target.value.split('\n') : []

    this.setState({
      [name]: R.reject(R.isEmpty, value)
    })
  }

  handleSubmit = e => {
    e.preventDefault()

    if (!R.equals(this.state, this.storage)) {
      chrome.runtime.sendMessage({
        type: 'setConfig',
        data: this.state
      })
    }

    window.close()
  }

  handleCancel = e => {
    e.preventDefault()

    window.close()
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit} className='psnine-plus-popup'>
        {
          Object.keys(SERVICES).map(serviceName => (
            this.makeCheckbox(SERVICES, serviceName)
          ))
        }

        {
          Object.keys(LIST_SERVICES).map(serviceName => (
            <div>
              {this.makeCheckbox(LIST_SERVICES, serviceName)}
              {this.makeTextarea(LIST_SERVICES, serviceName)}
            </div>
          ))
        }

        <input type='submit' value='确定' />
        <input type='button' value='取消' onClick={this.handleCancel} />
      </form>
    )
  }
}

render(
  <PsninePlusPopup />,
  document.getElementById('psnine-plus-popup')
)
