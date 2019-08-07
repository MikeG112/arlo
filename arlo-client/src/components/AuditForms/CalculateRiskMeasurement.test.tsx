import React from 'react'
import {
  render,
  fireEvent,
  waitForDomChange,
  wait,
} from '@testing-library/react'
import toastMock from 'react-toastify'
import CalculateRiskMeasurement from './CalculateRiskMeasurement'
import { statusStates } from './_mocks'
import apiMock from '../utilities'

jest.mock('../utilities')
jest.mock('react-toastify')

const setIsLoadingMock = jest.fn()
const updateAuditMock = jest.fn()
;(global as any).open = jest.fn()

describe('CalculateRiskMeasurement', () => {
  it('renders first round correctly', () => {
    const container = render(
      <CalculateRiskMeasurement
        audit={statusStates[3]}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
        updateAudit={updateAuditMock}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders completion in first round correctly', () => {
    const container = render(
      <CalculateRiskMeasurement
        audit={statusStates[4]}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
        updateAudit={updateAuditMock}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it(`handles inputs`, async () => {
    const { container, getByTestId, queryAllByText, getByText } = render(
      <CalculateRiskMeasurement
        audit={statusStates[3]}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
        updateAudit={updateAuditMock}
      />
    )

    expect(container).toMatchSnapshot()

    const choiceOne: any = getByTestId(`round-0-contest-0-choice-choice-1`)
    const choiceTwo: any = getByTestId(`round-0-contest-0-choice-choice-2`)

    fireEvent.change(choiceOne, { target: { value: -1 } })
    fireEvent.change(choiceTwo, { target: { value: -1 } })
    fireEvent.blur(choiceOne)
    fireEvent.blur(choiceTwo)
    expect(choiceOne.value).toBe('-1')
    expect(choiceTwo.value).toBe('-1')
    await wait(() => {
      expect(queryAllByText('Must be a positive number').length).toBe(2)
    })

    fireEvent.change(choiceOne, { target: { value: '0.5' } })
    fireEvent.change(choiceTwo, { target: { value: '0.5' } })
    fireEvent.blur(choiceOne)
    fireEvent.blur(choiceTwo)
    expect(choiceOne.value).toBe('0.5')
    expect(choiceTwo.value).toBe('0.5')
    await wait(() => {
      expect(queryAllByText('Must be an integer').length).toBe(2)
    })

    fireEvent.change(choiceOne, { target: { value: '' } })
    fireEvent.change(choiceTwo, { target: { value: '' } })
    fireEvent.blur(choiceOne)
    fireEvent.blur(choiceTwo)
    expect(choiceOne.value).toBe('')
    expect(choiceTwo.value).toBe('')
    await wait(() => {
      expect(queryAllByText('Must be a number').length).toBe(2)
    })

    fireEvent.change(choiceOne, { target: { value: '5' } })
    fireEvent.change(choiceTwo, { target: { value: '5' } })
    fireEvent.blur(choiceOne)
    fireEvent.blur(choiceTwo)
    expect(choiceOne.value).toBe('5')
    expect(choiceTwo.value).toBe('5')
    fireEvent.click(getByText('Calculate Risk Measurement'))

    waitForDomChange({ container }).then(
      () => {
        expect(apiMock).toBeCalledTimes(1)
        expect(setIsLoadingMock).toBeCalledTimes(1)
        expect(updateAuditMock).toBeCalledTimes(1)
        expect(toastMock).toBeCalledTimes(0)
      },
      error => {
        throw new Error(error)
      }
    )
  })
})
