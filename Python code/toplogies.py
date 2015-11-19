__author__ = 'farrukh'

from pymote import *

from numpy import sign, sqrt, array, pi, sin, cos
from numpy.random import rand

tests = 1
class Toplogy(NetworkGenerator):

    def generate_star_ehwsn_network(self, center=None, x_radius=100, y_radius=100, sector=1.0, clusters=1, is_random=0):
        """
        Generates network where nodes are located around a center/coordinator node.
        Parameter is_random controls random perturbation of the nodes
        """
        self.name = "Star EHWSN"
        net = Network(commRange=self.comm_range, **self.kwargs)
        h, w = net.environment.im.shape
        if center is None:
            center = (h/2, w/2)  # middle
        if clusters < 1:
            clusters = 1
        n_nets = int(self.n_count/clusters)

        for k in range(clusters):
            # Coordinator
            node = Node(commRange=(x_radius + y_radius)/clusters, node_type='C',
                        power_type=0, **self.kwargs)
            mid = (center[0] - 2 * k * x_radius,
                   center[1] - 2 * k * y_radius)
            net.add_node(node, pos=(mid[0], mid[1]))
            for n in range(n_nets)[1:]:
                    # Regular sensor node
                    node = Node(commRange=5, power_type=2, mobile_type=2, **self.kwargs)
                    if node.id == 5:
                        node.power.energy = node.power.E_MIN - 0.003
                    elif node.id == 10:  # just enough energy to send few messages
                        node.power.energy = node.power.E_MIN + 0.002
                        node.power.P_CHARGING = 0  # no charging
                    else:  # random energy level from 0 to 2 Joules
                        node.power.energy = rand()*2.0
                    rn = (rand(2) - 0.5)*(x_radius + y_radius)/2/clusters
                    ang = n *2*pi/n_nets * sector + pi*(1.0 - sector)
                    net.add_node(node, pos=(mid[0] + cos(ang)*(x_radius + rn[0]*is_random),
                                            mid[1] + sin(ang)*(y_radius + rn[0]*is_random)
                    ))

        return net

    def generate_star_network(self, center=None, x_radius=100, y_radius=100, sector=1.0, clusters=1, is_random=0):
        """
        Generates network where nodes are located around a center/coordinator node.
        Parameter is_random controls random perturbation of the nodes
        """
        self.name = "Star"
        net = Network(commRange=self.comm_range, **self.kwargs)
        h, w = net.environment.im.shape
        if center is None:
            center = (h/2, w/2)  # middle
        if clusters < 1:
            clusters = 1
        n_nets = int(self.n_count/clusters)

        for k in range(clusters):
            # Coordinator
            mid = (center[0] - 2 * k * x_radius,
                   center[1] - 2 * k * y_radius)
            #net.add_node(node, pos=(mid[0], mid[1]))
            for n in range(n_nets):
                    # Regular sensor node
                    node = Node(**self.kwargs)
                    rn = (rand(2) - 0.5)*(x_radius + y_radius)/4/clusters
                    ang = n *2*pi/n_nets * sector + pi*(1.0 - sector)
                    x = mid[0] + cos(ang)*(x_radius + rn[0]*is_random)
                    y = mid[1] + sin(ang)*(y_radius + rn[0]*is_random)
                    net.add_node(node, pos=(x, y))

        return net

    def generate_ring_network(self, center=None, x_radius=100, y_radius=100, sector=1.0, n_ring=5):
        """
        Generates network where nodes are located approximately homogeneous.

        Parameter randomness controls random perturbation of the nodes, it is
        given as a part of the environment size.

        """
        self.name = "Ring"
        net = Network(commRange=self.comm_range, **self.kwargs)
        h, w = net.environment.im.shape
        if center is None:
            center = (h/2, w/2)  # middle
        for _n in range(self.n_count/n_ring):

                    ang = n_ring * (_n + 1)*2*pi/self.n_count * sector  + pi/4  # start from 45 deg
                    for _r in range(n_ring):
                        rn = (rand(2) - 0.5)*(x_radius + y_radius)/3
                        node = Node(**self.kwargs)
                        net.add_node(node, pos=(center[0] + cos(ang)*x_radius + rn[0],
                                                center[1] + sin(ang)*y_radius + rn[1]),
                                                ori=ang)


        return net

    def generate_two_ring_network(self, center=None, x_radius=100, y_radius=100, sector=1.0, n_ring=5):
        """
        Generates network where nodes are located approximately homogeneous.

        Parameter randomness controls random perturbation of the nodes, it is
        given as a part of the environment size.

        """
        self.name = "Two Ring"
        net = Network(commRange=self.comm_range, **self.kwargs)
        h, w = net.environment.im.shape
        dir = 1.0  # ccw
        if center is None:
            center = (w/2, 3*h/4)  # one third up
        for _n in range(self.n_count/n_ring/2):

                    ang = dir * 2* n_ring * (_n + 1)*2*pi/self.n_count * sector  + pi/4  # start from 45 deg
                    for _r in range(n_ring):
                        rn = (rand(2) - 0.5)*(x_radius + y_radius)/4
                        node = Node(**self.kwargs)
                        net.add_node(node, pos=(center[0] + cos(ang)*x_radius + rn[0],
                                                center[1] + sin(ang)*y_radius + rn[1]),
                                                ori=ang)

        center = (w/2, h/4)  # one third
        dir = -1.0  # cw
        sector = 0.5
        for _n in range(self.n_count/n_ring/2):

                    ang = dir * (2 * n_ring * (_n + 1)*2*pi/self.n_count * sector)  # start from 0 deg
                    for _r in range(n_ring):
                        rn = (rand(2) - 0.5)*(x_radius + y_radius)/4
                        node = Node(**self.kwargs)
                        net.add_node(node, pos=(center[0] + cos(ang)*x_radius + rn[0],
                                                center[1] + sin(ang)*y_radius + rn[1]),
                                                ori=ang)

        return net

    def generate_grid_network(self, name=None, randomness=0, cut_shape=None):
        """
        Generates network where nodes are located approximately homogeneous in a grid

        Parameter randomness controls random perturbation of the nodes, it is
        given as a part of the environment size.

        """
        self.name = name or "Grid"
        net = Network(commRange=self.comm_range, **self.kwargs)
        h, w = net.environment.im.shape
        area = h * w
        sq = int(round(sqrt(self.n_count)))
        nr = 1.04 * (sqrt(self.n_count) * area / self.n_count / h)
        k = 0
        cut_area = 0
        if cut_shape:
            for box in cut_shape:
                cut_area += (box[1][0] - box[0][0])*(box[0][1] - box[1][1])
        self.area = area - cut_area
        done = False
        for x in range(0, self.n_count / sq + 1):
            if done:
                break
            for y in range(0, self.n_count / sq):
                rn = rand(2) * randomness
                xpos = round((x + rn[0]) * nr, 2)
                ypos = round((y + rn[1]) * nr, 2)
                inside = True
                if cut_shape:
                    for box in cut_shape:
                        #print box[0], box[1],  xpos, ypos
                        if xpos >= box[0][0] and xpos <= box[1][0] and \
                                        ypos <= box[0][1] and ypos >= box[1][1]:
                            #print "not in"
                            inside = False
                if inside:
                    k += 1
                    node = Node(**self.kwargs)
                    net.add_node(node, pos=(xpos, ypos))

                if (k >= self.n_count):
                    done = True
                    break

        if self.degree:
            self.n_max = len(net)
            net = self.generate_random_network(net)  # adjust for degree by changing comm_range

        self.net_density = 1.0 * len(net)/self.area
        return net

    def generate_web_network(self, randomness=0):
        """
        Generates network where nodes are located approximately homogeneous in a grid

        Parameter randomness controls random perturbation of the nodes, it is
        given as a part of the environment size.

        """
        self.name = "Grid"
        net = Network(commRange=self.comm_range, **self.kwargs)
        h, w = net.environment.im.shape
        area = h * w
        sq = int(round(sqrt(self.n_count)))
        nr = sqrt(self.n_count) * area/self.n_count/h
        k = 0
        print nr, sq
        for x in range(self.n_count/sq + 1):
            for y in range(self.n_count/sq):
                k += 1
                rn = rand(2)*randomness
                node = Node(**self.kwargs)
                net.add_node(node, pos=(int((x + rn[0])*nr), int((y + rn[1])*nr)))
                if (k >= self.n_count):
                    return net

        return net

    def generate_manual_network(self, randomness=0):

        from pymote.conf import global_settings
        from pymote.environment import Environment2D

        self.n_count = 0
        self.name = "Manual"
        net = Network(environment=Environment2D(shape=(200,200)), commRange=75)
        h, w = net.environment.im.shape

        node = Node(node_type='C')
        net.add_node(node, pos=(h/2, w/2))
        self.n_count +=1

        node = Node(node_type='N')
        net.add_node(node, pos=(h/3, w/3))
        self.n_count +=1

        node = Node(node_type='N', mobile_type=2, power_type=2)
        net.add_node(node, pos=(2*h/3, 2*w/3))
        self.n_count +=1

        node = Node(node_type='B')
        net.add_node(node, pos=(50, 150))
        self.n_count +=1

        #auto add a node 'N'
        net.add_node(pos=(150, 50))
        self.n_count +=1

        #auto add a node 'N' at random location
        net.add_node()
        self.n_count +=1

        return net
