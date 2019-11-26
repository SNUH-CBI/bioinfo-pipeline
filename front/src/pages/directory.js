import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css'
import { Row, Col, ResponsiveEmbed } from 'react-bootstrap'
import Iframe from 'react-iframe'
import {
  MdChevronRight,
  MdKeyboardArrowDown,
  MdFolder,
  MdFolderOpen,
  MdInsertDriveFile,
  MdPictureAsPdf
} from "react-icons/md";
import {
  AiOutlineFileJpg,
  AiOutlineHtml5
} from "react-icons/ai";
import { FiFileText } from "react-icons/fi"

const icons = {
  expandClose: <MdChevronRight />,
  expandOpen: <MdKeyboardArrowDown />,
  parentClose: <MdFolder />,
  parentOpen: <MdFolderOpen />,
  leaf: <MdInsertDriveFile />
};

const nodesample = [{
  type: "directory",
  label: "dep1",
  value: "/dep1",
  children: [
    {
      type: "directory",
      label: "dep2-1",
      value: "/dep1/dep2-1",
      children: [
        {
          type: "file",
          label: "logo512.jpg",
          value: "logo512.png"
        }
      ]
    },
    {
      type: "directory",
      label: "dep2-2",
      value: "/dep1/dep2-2",
      children: []
    }
  ]
},
{
  type: 'file',
  label: 'sample.pdf',
  value: 'sample.pdf' }]

const nodeparse = (node) => {
  return node.map((index) => {
    if (index.children === undefined || index.children.length === 0)
      return {
        ...index, showCheckbox: false, icon: iconconfrim(index)
      };
    else return { ...index, children: nodeparse(index.children), showCheckbox: false };
  });
}

const iconconfrim = (index) => {
  console.log(index)
  if (index.type === 'directory') return <MdFolder />
  switch (index.label.slice(-4)) {
    case '.jpg':
      return <AiOutlineFileJpg />
    case '.pdf':
      return <MdPictureAsPdf />
    case '.txt':
      return <FiFileText />
    case 'html':
      return <AiOutlineHtml5 />
    default:
      return <MdInsertDriveFile />
  }
}

export default class Directory extends React.Component {
  state = {
    expanded: [],
    clicked: [],
    path: '',
    node: []
  }


  componentDidMount = () => {
    this.setState({ node: nodeparse(nodesample) });
  }


  isCookie = () => {
    if (this.props.cookie.biopipe !== 'pw') {
      alert("wrong pw for this page")
      return <Redirect to={this.props.match.params.path + '/auth'} />
    }
    else return <br />;
  }
  render() {
    return (
      <div>
        <this.isCookie />
        <Row>
          <Col md="auto">
            <CheckboxTree
              nodes={this.state.node}
              expanded={this.state.expanded}
              onExpand={expanded => this.setState({ expanded })}
              onClick={clicked => { if (clicked.children === undefined) { this.setState({ path: clicked.value }); } }}//post func
              icons={icons}
              expandOnClick={true}
            />
          </Col>
          <Col>
            <div style={{ width: 'auto', height: 'auto' }}>
              <ResponsiveEmbed aspectRatio="16by9">
                <Iframe src={this.state.path} />
              </ResponsiveEmbed>
            </div>
          </Col>
        </Row>
        <br />
        <Link to={this.props.match.params.path + '/auth'}>go auth page</Link>
      </div>
    );
  }
}