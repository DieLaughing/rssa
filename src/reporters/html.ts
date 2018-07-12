
/* IMPORT */

import * as _ from 'lodash';
import {abstract} from './abstract';
import config from '../config';
import Utils from '../utils';

/* HTML */

class html extends abstract {

  /* HELPERS */

  _getExtension () {

    return '.html';

  }

  /* RENDER */

  renderDates () {

    if ( this.lastUpdate ) {

      const date = new Date ( this.lastUpdate ).toString ();

      this.renderLine ( `Prev update time: ${date}`, 'p' );

    }

    const date = new Date ().toString ();

    this.renderLine ( `Curr update time: ${date}`, 'p' );

    this.renderLine ();

  }

  renderFeed () {

    Utils.feed.walk ( this.feeds, _.noop, ( group, config, depth ) => {

      this.renderLine ( group.name, 'h4', depth );

    }, ( feed, config, depth ) => {

      if ( !this.tokensAll[config.url] ) return;

      if ( config.filter && !config.filter ( this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll ) ) return;

      const template = this._getTemplate ( config, 'html', 'txt' ),
            lines = this._parseTemplate ( template, this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll );

      this.renderLines ( lines, 'p', depth );

    });

  }

  renderLines ( lines, tag?, depth?, spaces? ) {

    lines.forEach ( line => this.renderLine ( line, tag, depth, spaces ) );

  }

  renderLine ( line = '', tag = 'span', depth = 0, spaces = 4 ) {

    const indentation = _.repeat ( _.repeat ( '\u00A0', spaces ), depth ); // Avoiding space collapse

    this.rendered += `<${tag}>${indentation}${line}</${tag}>`;

  }

  render () {

    this.rendered = '';

    this.renderDates ();
    this.renderFeed ();

  }

  /* API */

  async run ( save: boolean = config.report.save, open: boolean = true ) {

    return super.run ( save, open );

  }

}

/* EXPORT */

export {html};
