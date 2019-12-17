import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import axios from 'axios';
import 'react-checkbox-tree/lib/react-checkbox-tree.css'
import { Rnd } from 'react-rnd'
import Iframe from 'react-iframe'
import { ButtonGroup, Button } from 'react-bootstrap'
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
  switch (index) {
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
    frameData: '',
    node: [],
    width: window.innerWidth - 140,
    permissionOK: false,
    clickedMenu: ''
  }

  checkPermission = () => {
    axios.defaults.withCredentials = true
    axios({
      method: 'post',
      url: 'http://210.117.211.208:36002/path/' + this.props.match.params.path
    })
      .then((response) => {
        if (response.data.success) {
          this.setState({ node: nodeparse([response.data.result]) })
          this.setState({ permissionOK: true })
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

  getStaticFile = (value) => {
    const { frameData } = this.state
    const url = 'http://210.117.211.208:36002/static/' + value
    this.setState({ frameData: url }, () => console.log(this.state.frameData))
  }

  getRndButtonLayout = () => {
    switch (this.state.clickedMenu) {
      case 'Raw_fastQC':
      case 'Filtered_fastQC':
      case 'Qualimap_UCSC':
        return <span></span>

      case 'Sample_Correlation':
        return <ButtonGroup>
          <Button>Correlation Matrix</Button>
          <Button>Correlation Heatmap</Button>
          <Button>PCA</Button>
        </ButtonGroup>

      case 'DEG':
        return <ButtonGroup>
          <Button>Count</Button>
          <Button>FPKM</Button>
          <Button>TPM</Button>
        </ButtonGroup>

      case 'GSA':
        return <ButtonGroup>
          <Button>GO_BP</Button>
          <Button>GO_CC</Button>
          <Button>GO_MF</Button>
          <Button>KEGG</Button>
        </ButtonGroup>

      default:
        return <span></span>
    }
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    if (!this.state.permissionOK) this.checkPermission()
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: (window.innerWidth - this.state.pageX) });
  }

  handleOnClick = (e, v) => {
    console.log(v)
    this.setState({ clickedMenu: v })
  }

  render() {
    return (
      <div className="d-flex flex-column flex-cont">
        <ButtonGroup>
          <Button onClick={e => this.handleOnClick(e, 'Home')}>Home</Button>
          <Button onClick={e => this.handleOnClick(e, 'Raw_fastQC')}>Raw_fastQC</Button>
          <Button onClick={e => this.handleOnClick(e, 'Filtered_fastQC')}>Filtered_fastQC</Button>
          <Button onClick={e => this.handleOnClick(e, 'RSEM_UCSC')}>RSEM_UCSC</Button>
          <Button onClick={e => this.handleOnClick(e, 'Sample_Correlation')}>Sample_Correlation</Button>
          <Button onClick={e => this.handleOnClick(e, 'DEG')}>DEG</Button>
          <Button onClick={e => this.handleOnClick(e, 'GSA')}>GSA</Button>
        </ButtonGroup>
        <div>
          <CheckboxTree
            nodes={this.state.node}
            expanded={this.state.expanded}
            onExpand={expanded => this.setState({ expanded })}
            onClick={clicked => {
              if (clicked.children === undefined) {
                this.getStaticFile(clicked.value)
              }
            }}
            icons={icons}
            expandOnClick={true}
          />
          <Rnd
            className="d-flex flex-column"
            ref={c => { this.rnd = c }}
            default={{ x: 140, y: 0 }}
            style={{ borderLeft: '3px double grey', background: 'whitesmoke' }}
            bounds="window"
            disableDragging="true"
            size={{ width: this.state.width, height: '90%' }}
            enableResizing={onlyLeft}
            onResizeStop={(e, direction, ref, delta, position) => {
              this.setState({ width: Math.min(window.innerWidth, window.innerWidth - e.pageX) })
            }}
          >
            <this.getRndButtonLayout/>
            <Iframe src={this.state.frameData} width="100%" height="100%" />
          </Rnd>
        </div>
      </div>
    );
  }
}