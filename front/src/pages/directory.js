import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import axios from 'axios';
import 'react-checkbox-tree/lib/react-checkbox-tree.css'
import { Rnd } from 'react-rnd'
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

const onlyLeft = {
  top: false, right: false, bottom: false, left: true,
  topRight: false, bottomRight: false, bottomLeft: false, topLeft: false
}

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
    node: [],
    success: false,
    width: window.innerWidth - 140,
    pageX: 140
  }

  checkPermission = () => {
    axios.defaults.withCredentials = true
    axios({
      method: 'post',
      url: 'http://localhost:4000/path/' + this.props.match.params.path
    })
      .then((response) => {
        if (response.data.success) {
          this.setState({ success: true })
          this.setState({ node: nodeparse(response.data.result) })
        }
        else {
          alert("wrong password");
          this.props.history.push(this.props.match.params.path + '/auth')
        }
      })
      .catch((error) => {
        console.log(error)
        alert("error occured. check console log");
      })
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: (window.innerWidth - this.state.pageX) });
  }

  render() {
    if (!this.state.success) this.checkPermission()
    return (
      <div>
        <CheckboxTree
          nodes={this.state.node}
          expanded={this.state.expanded}
          onExpand={expanded => this.setState({ expanded })}
          onClick={clicked => {
            if (clicked.children === undefined) {
              this.setState({ path: clicked.value })
            }
          }}
          icons={icons}
          expandOnClick={true}
        />
        <Rnd
          default={{ x: 140, y: 0 }}
          style={{ borderLeft: '1px double grey', background: 'whitesmoke' }}
          bounds="window"
          disableDragging="true"
          size={{ width: this.state.width, height: '100%' }}
          enableResizing={onlyLeft}
          onResizeStop={(e, direction, ref, delta, position) => {
            this.setState({ width: Math.min(window.innerWidth, window.innerWidth - e.pageX) })
            this.setState({ pageX: Math.max(0, e.pageX) })
          }}
        >
          <Iframe src={this.state.path} width="100%" height="100%" />
        </Rnd>

      </div>
    );
  }
}