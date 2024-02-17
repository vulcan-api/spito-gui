#!/bin/bash

interface=org.avorty.spito.gui
member=Confirm

dbus-monitor --profile "interface='$interface',member='$member'" #|