/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myConfig = new Object();

/**
 * class LocalMap
 * @constructor
 */
function LocalMap()
{
	var self = this;
	this.items = new Object();
	
	this.setItem = function(key, value)
	{
		self.items[key] = value;
	};
	
	this.getItem = function(key)
	{
		return self.items[key];
	};
	
	this.removeItem = function(key)
	{
		delete self.items[key];
	}
}

/**
 * class ConfigStorage
 * @constructor
 */
function ConfigStorage()
{
	var self = this;
	this.defaultValues = new Object();
	this.defaultValues["PlaySoundEvents"] = true;

	this.config = new LocalMap();
	// Check whether localStorage is available and active.
    try
	{
		if (window.localStorage)
		{
			window.localStorage.setItem("PokerTH-live", "1");
			window.localStorage.removeItem("PokerTH-live");
			this.config = window.localStorage;
		}
    }
	catch(e)
	{
    }
	
	this.set = function(key, value)
	{
		if (value === self.defaultValues[key])
		{
			self.config.removeItem(key);
		}
		else
		{
			self.config.setItem(key, JSON.stringify(value));
		}
	};

	this.get = function(key)
	{
		var retVal;
		var value = self.config.getItem(key);
		try
		{
			retVal = JSON.parse(value);
		}
		catch(e)
		{
		}
		if (typeof retVal === 'undefined' || retVal === null)
		{
			retVal = self.defaultValues[key];
		}
		return retVal;
	};
}


function initConfigStorage()
{
	myConfig = new ConfigStorage();
}

window.addEventListener("load", initConfigStorage, false);
