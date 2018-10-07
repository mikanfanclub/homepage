import React from 'react';
import { render } from 'react-dom';
import ScrollReveal from 'scrollreveal';
// import PortfolioModal from './containers/portfolio_modal_container';

// render(<h1>Hello, React!</h1>, document.getElementById('root'));

const scrollRevealClass = document.getElementsByClassName('reveal');
if (scrollRevealClass) {
  for (let i = 0; i < scrollRevealClass.length; ++i) {
    const node = scrollRevealClass[i];
    const data = node.detaset;
    console.log(data);
    ScrollReveal().reveal(node, {
      delay: 1000 * 0.2,
      distance: '35px',
      duration: 1000 * 2,
      rotate: { x: 0, z: 0 },
      scale: 1
    });
  }
}

// const modalClass = document.getElementsByClassName('portfolio-modal-container');
// if (modalClass) {
//   for (let i = 0; i < modalClass.length; ++i) {
//     const node = modalClass[i];
//     render(<PortfolioModal />, node);
//   }
// }
