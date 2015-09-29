// set up SVG for D3
var width  = 500,
    height = 350,
    colors = d3.scale.category10(),
    bordercolor='black',
    border=3,
    directed=false,
    default_node_color='green',
    graph_edit=true;



var svg = d3.select('body').select('#mainContainer')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('border',border);

var svgBorder = svg.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("height", height)
.attr("width", width)
.style("stroke", bordercolor)
.style("fill", "none")
.style("stroke-width", border);


// set up initial nodes and links
//  - nodes are known by 'id', not by index in array.
//  - reflexive edges are indicated on the node (as a bold black circle).
//  - links are always source < target; edge directions are set by 'left' and 'right'.
/*
var nodes = [
    {id: 0, reflexive: false},
    {id: 1, reflexive: false },
    {id: 2, reflexive: false}
  ],
  nodeCount = 2,
  links = [
    {source: nodes[0], target: nodes[1], left: false, right: true },
    {source: nodes[1], target: nodes[2], left: false, right: true }
  ];
  */

  //d3.json("node.js",restart());
  /*
var adjList=[{
  nodes[0]:[
{dest: nodes[1]},
{dest: nodes[2]}
  ],


}];*/
// init D3 force layout
var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(100)
    .charge(-150)
    .on('tick', tick)

// define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

// line displayed when dragging new nodes
var drag_line = svg.append('svg:path')
  .attr('class', 'link dragline hidden')
  .attr('d', 'M0,0L0,0');

// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
    circle = svg.append('svg:g').selectAll('g');

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}

function loadGraph()
{
  nodes="";
  link="";


}
function generateGraph()
{
  nodes=[];
  links=[];
  var element = document.getElementById("GraphList");
  var graphName = element.options[element.selectedIndex].text;
  var nodeNum = Number(document.getElementById("NodeNum")).value;
  document.getElementById("AdjList").innerHTML=document.getElementById("NodeNum").value;

  var point = d3.mouse(this),
  node = {id: nodeNum, reflexive: false};
  node.x = point[0];
  node.y = point[1];
  nodes.push(node);

/*
    for(var i=0;i<nodeNum;i++)
    {
      vertex = {id: nodeNum, reflexive: false};
      vertex.x=0;
      vertex.y=0;
      nodes.push(vertex);
    }
    */
    restart();


}
// update force layout (called automatically each iteration)
function tick() {
  // draw directed edges with proper padding from node centers
  if(!graph_edit) return;
  path.attr('d', function(d) {
    var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = d.left ? 17 : 12,
        targetPadding = d.right ? 17 : 12,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);
    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
  });

  circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}

// update graph (called when needed)
function restart() {
  if(!graph_edit) return;
  // path (link) group
  path = path.data(links);

  nodeCount=nodes.length;
  if(!graph_edit) return;
  if(directed)
  {
  path.classed('selected', function(d) { return d === selected_link; })
    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });
  }
  else
  {
    path.classed('selected', function(d) { return d === selected_link; })
    .style('marker-start', '')
    .style('marker-end', '');
  }

  // add new links
  if(!graph_edit) return;
  if(directed)
  {
  path.enter().append('svg:path')
    .attr('class', 'link')
    .classed('selected', function(d) { return d === selected_link; })
    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;

      // select link
      if(!graph_edit) return;
      mousedown_link = d;
      if(mousedown_link === selected_link) selected_link = null;
      else selected_link = mousedown_link;
      selected_node = null;
      restart();
    });
  }
  else
  {
    path.enter().append('svg:path')
      .attr('class', 'link')
      .classed('selected', function(d) { return d === selected_link; })
      .on('mousedown', function(d) {
        if(d3.event.ctrlKey) return;

        // select link
        if(!graph_edit) return;
        mousedown_link = d;
        if(mousedown_link === selected_link) selected_link = null;
        else selected_link = mousedown_link;
        selected_node = null;
        restart();
      });
  }

  // remove old links
  if(!graph_edit) return;
  path.exit().remove();


  // circle (node) group
  // NB: the function arg is crucial here! nodes are known by id, not by index!
  if(!graph_edit) return;
  circle = circle.data(nodes, function(d) { return d.id; });

  // update existing nodes (reflexive & selected visual states)
  if(!graph_edit) return;
  circle.selectAll('circle')
    .style('fill', default_node_color)
    .classed('reflexive', function(d) { return d.reflexive; });

  // add new nodes
  var g = circle.enter().append('svg:g');

  g.append('svg:circle')
    .attr('class', 'node')
    .attr('r', 15)
    .style('fill', default_node_color)
    .style('stroke', function(d) { return d3.rgb(colors(d.id)).darker().toString(); })
    .classed('reflexive', function(d) { return d.reflexive; })
    .on('mouseover', function(d) {
      if(!mousedown_node || d === mousedown_node) return;



      // enlarge target node
      d3.select(this).attr('transform', 'scale(1.1)');
    })
    .on('mouseout', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // unenlarge target node
      d3.select(this).attr('transform', '');
    })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;

      // select node
      mousedown_node = d;
      if(mousedown_node === selected_node) selected_node = null;
      else selected_node = mousedown_node;
      selected_link = null;

      // reposition drag line
      if(directed)
      {
      drag_line
        .style('marker-end', 'url(#end-arrow)')
        .classed('hidden', false)
        .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);
      }
      else
      {
        drag_line
          .classed('hidden', false)
          .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);
      }
      restart();
    })
    .on('mouseup', function(d) {
      if(!mousedown_node) return;

      // needed by FF
      drag_line
        .classed('hidden', true)
        .style('marker-end', '');

      // check for drag-to-self
      mouseup_node = d;
      if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

      // unenlarge target node
      d3.select(this).attr('transform', '');

      // add link to graph (update if exists)
      // NB: links are strictly source < target; arrows separately specified by booleans
      var source, target, direction;
      if(mousedown_node.id < mouseup_node.id) {
        source = mousedown_node;
        target = mouseup_node;
        direction = 'right';
      } else {
        source = mouseup_node;
        target = mousedown_node;
        direction = 'left';
      }

      var link;
      link = links.filter(function(l) {
        return (l.source === source && l.target === target);
      })[0];

      if(link) {
        if(directed)
        {
          link[direction] = true;
        }
        else
        {
          link['left']=true;
          link['right']=true;
        }

      } else {
        link = {source: source, target: target, left: false, right: false};

        if(directed)
        {
          link[direction] = true;
        }
        else
        {
          link['left']=true;
          link['right']=true;
        }
        links.push(link);
      }

      // select new link
      selected_link = link;
      selected_node = null;
      restart();
    });

  // show node IDs
  g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text(function(d) { return d.id; });

  // remove old nodes
  circle.exit().remove();

  // set the graph in motion
  force.start();
  printGraphInfo();
}

function mousedown() {
  if(!graph_edit) return;
  // prevent I-bar on drag
  //d3.event.preventDefault();

  // because :active only works in WebKit?
  svg.classed('active', true);

  if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;
  if(!graph_edit) return;
  else{
  // insert new node at point
  var point = d3.mouse(this),
      node = {id: ++nodeCount, reflexive: false};
  node.x = point[0];
  node.y = point[1];
  nodes.push(node);
//  printGraphInfo()
  restart();
  }
}
function changeGraphTypeButton()
{
  if(directed)
  {
    directed=false;
    //convert directed graph to undirected

    links.forEach(function(link){
      link.left=true;
      link.right=true;
    });


     document.getElementById("graphTypeButton").innerHTML="Undirected";
    restart();
    force.start();
  }
  else
  {
    directed=true;
     document.getElementById("graphTypeButton").innerHTML="Directed";
    restart();
  }
}
function editModeButton()
{
  /*
      var contentents=nodes;
      var fileame="file.txt";
      var pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
      pom.setAttribute('download', fileName);
      pom.click();
*/
  if(graph_edit)
  {
    graph_edit=false;
    document.getElementById("editorButton").innerHTML="Off";
  }
  else
  {
    document.getElementById("editorButton").innerHTML="On";
    graph_edit=true;
  }

  return true;
}
function printGraphInfo()
{

  document.getElementById("NodeCount").innerHTML = nodeCount;
  document.getElementById("AdjList").innerHTML="";
  document.getElementById("JSONList").innerHTML="";

  nodes.forEach(function(node){
    document.getElementById("AdjList").innerHTML +=node.id+'  ';
    document.getElementById("JSONList").innerHTML+="["+node.id+",-1,[";
      var strAdjlinks="";
      var strJSONlinks="";

      links.forEach(function(link){

        if(link.source.id==node.id && link.right==true)
        {
          strAdjlinks+=link.target.id+',';
          strJSONlinks+="["+link.target.id+",-1],";
        }
        if(link.target.id==node.id && link.left==true)
        {
          strAdjlinks+=link.source.id+',';
          strJSONlinks+="["+link.source.id+",-1],";
        }
      });
      strAdjlinks=strAdjlinks.substring(0, strAdjlinks.length-1);
      strJSONlinks=strJSONlinks.substring(0, strJSONlinks.length-1);
      document.getElementById("AdjList").innerHTML +=strAdjlinks+'<br/>';
      document.getElementById("JSONList").innerHTML +=strJSONlinks+']]<br/>';

    });


}

function mousemove() {
  if(!graph_edit) return;
  if(!mousedown_node) return;

  // update drag line
  drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

  restart();
}

function mouseup() {
  if(!graph_edit) return;
  if(mousedown_node) {
    // hide drag line
    drag_line
      .classed('hidden', true)
      .style('marker-end', '');
  }

  // because :active only works in WebKit?
  svg.classed('active', false);

  // clear mouse event vars
  resetMouseVars();
}

function spliceLinksForNode(node) {
  if(!graph_edit) return;
  var toSplice = links.filter(function(l) {
    return (l.source === node || l.target === node);
  });
  toSplice.map(function(l) {
    links.splice(links.indexOf(l), 1);
  });
}

// only respond once per keydown
var lastKeyDown = -1;

function keydown() {
  if(!graph_edit) return;
//  d3.event.preventDefault();

  if(lastKeyDown !== -1) return;
  lastKeyDown = d3.event.keyCode;

  // ctrl
  if(d3.event.keyCode === 17) {
    circle.call(force.drag);
    svg.classed('ctrl', true);
  }

  if(!selected_node && !selected_link) return;
  switch(d3.event.keyCode) {
    case 8: // backspace
    case 46: // delete
    if(nodeCount>=1)
    {

            if(selected_node) {
        nodes.splice(nodes.indexOf(selected_node), 1);
        spliceLinksForNode(selected_node);
        nodeCount--;
      } else if(selected_link) {
        links.splice(links.indexOf(selected_link), 1);
      }
      selected_link = null;
      selected_node = null;
      restart();
    }
    else
      alert('Node Count must not be less than zero.');
      break;
    case 66: // B
      if(selected_link) {
        // set link direction to both left and right
        selected_link.left = true;
        selected_link.right = true;
      }
      restart();
      break;
    case 76: // L
      if(selected_link) {
        // set link direction to left only
        selected_link.left = true;
        selected_link.right = false;
      }
      restart();
      break;
    case 82: // R
      if(selected_node) {
        // toggle node reflexivity
        selected_node.reflexive = !selected_node.reflexive;
      } else if(selected_link) {
        // set link direction to right only
        selected_link.left = false;
        selected_link.right = true;
      }
      restart();
      break;
  }
}

function keyup() {
  if(!graph_edit) return;
  lastKeyDown = -1;

  // ctrl
  if(d3.event.keyCode === 17) {
    circle
      .on('mousedown.drag', null)
      .on('touchstart.drag', null);
    svg.classed('ctrl', false);
  }
}

// app starts here
svg.on('mousedown', mousedown)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);
d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);
restart();
