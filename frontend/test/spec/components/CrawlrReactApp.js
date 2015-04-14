'use strict';

describe('Main', function () {
  var React = require('react/addons');
  var CrawlrReactApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    CrawlrReactApp = require('components/CrawlrReactApp.js');
    component = React.createElement(CrawlrReactApp);
  });

  it('should create a new instance of CrawlrReactApp', function () {
    expect(component).toBeDefined();
  });
});
