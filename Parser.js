var Bin = function() {
	this.par1;
	this.par2;
} 

Bin.prototype.calc = function(par1, par2, x, y, z, op) {
	var res1 = par1.evaluate(x, y, z);
	var res2 = par2.evaluate(x, y, z);
	return eval('res1' + op + 'res2');
}
Bin.prototype.init = function(x, y) {
	this.par1 = x;
	this.par2 = y;
}
Bin.prototype.getstr = function(x) {
	var res = '(' + x + ' '+ this.par1.prefix() + ' '; 
	res += this.par2.prefix() + ')';
	return res;
}


var Add = function(arg1, arg2) {
	this.init(arg1, arg2);
}

Add.prototype = Object.create(Bin.prototype);

Add.prototype.evaluate = function(x, y, z) {
	return this.calc(this.par1, this.par2, x, y, z, '+');
}
Add.prototype.prefix = function() {
	return this.getstr('+');
}


var Subtract = function(arg1, arg2) {
	this.init(arg1, arg2);
}

Subtract.prototype = Object.create(Bin.prototype);

Subtract.prototype.evaluate = function(x, y, z) {
	return this.calc(this.par1, this.par2, x, y, z, '-');
}
Subtract.prototype.prefix = function() {
	return this.getstr('-');
}


var Multiply = function(arg1, arg2) {
	this.init(arg1, arg2);
}

Multiply.prototype = Object.create(Bin.prototype);

Multiply.prototype.evaluate = function(x, y, z) {
	return this.calc(this.par1, this.par2, x, y, z, '*');
}
Multiply.prototype.prefix = function() {
	return this.getstr('*');
}

var Divide = function(arg1, arg2) {
	this.init(arg1, arg2);
	
}
Divide.prototype = Object.create(Bin.prototype);

Divide.prototype.evaluate = function(x, y, z) {
	return this.calc(this.par1, this.par2, x, y, z, '/');
}
Divide.prototype.prefix = function() {
	return this.getstr('/');
}


var Negate = function(arg) {
	this.evaluate = function(x, y, z) {
		return -arg.evaluate(x, y, z);
	}
	this.prefix = function() {
		return '(negate ' + arg.prefix() + ')';
	}
}

var Const = function(arg) {
	this.evaluate = function() {
		return arg;
	}
	
	this.prefix = function() {
		return String(arg);
	}
}
Const.prototype = Number;

var Variable = function(arg) {
	this.evaluate = function(x, y, z) {
		return eval(arg);
	}
	this.prefix = function() {
		return String(arg);
	}
} 


var Cos = function(arg) {
	this.evaluate = function(x, y, z) {
		return Math.cos(arg.evaluate(x, y, z));
	}
	this.prefix = function() {
		return '(cos ' + arg + ')';
	}
}


var Sin = function(arg) {
	this.evaluate = function(x, y, z) {
		return Math.sin(arg.evaluate(x, y, z));
	}
	this.prefix = function() {
		return '(sin ' + arg + ')';
	}
}

var Exp = function(arg) {
	this.evaluate = function(x, y, z) {
		return Math.exp(arg);
	}
	this.prefix = function() {
		return '(exp ' + arg + ')';
	}
}


var ArcTan = function(arg) {
	this.evaluate = function(x, y, z) {
		return Math.atan(arg);
	}
	this.prefix = function() {
		return '(atan ' + arg + ')';
	}
}



var parsePrefix = function(x) {
	var expr;
	var n = x.length;
	if(n == 0)
		throw new Error("Empty expression");
	var i = 0;
	try {
		var getNumb = function() {
			var res = 0;
			while('0' <= x[i] && x[i] <= '9') {
				res = res * 10 + x[i] - '0';
				i++;
			}
			return new Const(res);
		}
		var getElement = function() {
			if(x[i] != ' ')
				throw new Error(i + ": Missing spaces");
			i++;
			if(x[i] == '(') {
				var res = getExpr();
			} 
			else 
				if("xyz".indexOf(x[i]) != -1) {
					res = new Variable(x[i]);
					i++;
				}
				else 
					if('0' <= x[i] && x[i] <= '9') {
						res = getNumb();			
					}
					else
						throw new Error(i + ": illegal element");
			
			return res;
		}
		var getExpr = function() {
			if(x[i] != '(')
				throw new Error(i + ": Missing bracket");
			var res;
			i++;
			if(x.substr(i, i + 6) == 'negate') {
				i += 6;
				res = new negate(getElement());
			} else
			if(x.substr(i, i + 3) == 'exp') {
				i += 3;
				res = new Exp(getElement());
			} else
			if(x.substr(i, i + 4) == 'atan') {
				i += 4;
				res = new ArcTan(getElement());
			} else
			if(x[i] == '+') {
				i++;
				res = getElement();
				res = new Add(res, getElement());
			} else
			if(x[i] == '-') {
				i++;
				res = getElement();
				res = new Subtract(res, getElement());
			} else
			if(x[i] == '*') {
				i++;
				res = getElement();
				res = new Multiply(res, getElement());
			} else
			if(x[i] == '/') {
				i++;
				res = getElement();
				res = new Divide(res, getElement());
			} else
				throw new Error(i + ": Undefined operation");
			if(x[i] != ')')
				throw new Error(i + ": Missing brackets");
			i++;
			return res;
		}
		
		if(x[0] != '(') {
			x = ' ' + x;
			var res = getElement();
			if(i <= n)
				throw new Error(i + ": Invalid structure");
			return res;
		} else {
			var res = getExpr();
			if(i < n)
				throw new Error(i + ": Too many elements");
			return res;
		}
	}
	catch(err) {
		//println(err);
		throw new AssertionError();
	}
}
