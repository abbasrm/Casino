import React from 'react';
import { configure, shallow,render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from './App';

configure({ adapter: new Adapter() });

describe('<App />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = render(<App />);
    wrapper.setState({ coins: 10000, freeBet: false, messages: ['']});
  })
  it('Add 20 coins in case of winning', () => {
    const bet = wrapper.find(".bet");
    expect(bet).toHaveLength(1);
    const val = +bet.textContent;
    bet.simulate('click');
    expect(bet.textContent).toEqual(val+10);
  })
})