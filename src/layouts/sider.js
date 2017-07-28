import React from 'react';
import { Link } from 'react-router';

export default class Sider extends React.Component {
    render() {
        return (
            <nav>
        <Link to="/">Home</Link>
      </nav>
        );
    }
}
