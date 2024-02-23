#!/bin/bash

interface=org.avorty.spito.gui
member=Decline

dbus-monitor --profile "interface='$interface',member='$member'" #|