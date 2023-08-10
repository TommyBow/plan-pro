import React from 'react';
import renderer from 'react-test-renderer';
import MyComponent from './App';

test('MyComponent snapshot', () => {
  const component = renderer.create(<MyComponent />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
