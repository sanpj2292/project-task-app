import React from "react";
import { Typography } from "antd";

const { Paragraph } = Typography;

class Description extends React.Component {
    state = {
        expand: false,
        counter: 0
    };

    typoExpand = () => {
        this.setState({
            expand: true,
            counter: !this.state.expand
                ? this.state.counter + 0
                : this.state.counter + 1
        });
    };

    typoClose = () => {
        this.setState({
            expand: false,
            counter: !this.state.expand
                ? this.state.counter + 0
                : this.state.counter + 1
        });
    };

    renderParagraph() {
        return (
            <div key={this.state.counter}>
                <Paragraph
                    ellipsis={
                        {
                            rows: this.props.rows ? this.props.rows : 1,
                            expandable: true,
                            onExpand: this.typoExpand
                        }
                    }
                >
                    {this.props.content}
                </Paragraph>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderParagraph()}
                {this.state.expand && <a href='' onClick={this.typoClose}>Close</a>}
            </div>
        );
    }

}

export default Description;