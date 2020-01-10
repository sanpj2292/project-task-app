import React from "react";
import { Typography, Button } from "antd";

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
                ? this.state.counter
                : this.state.counter + 0.5
        });
    };

    typoClose = () => {
        this.setState({
            expand: false,
            counter: !this.state.expand
                ? this.state.counter
                : this.state.counter + 0.5
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
                {this.state.expand &&  <Button type="link" onClick={this.typoClose}>Close</Button>}
            </div>
        );
    }

}

export default Description;