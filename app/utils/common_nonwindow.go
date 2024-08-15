//go:build !windows

package utils

import (
	"os/exec"
)

func runCommand(name string, arg ...string) ([]byte, error) {
	cmd := exec.Command(name, arg...)
	return cmd.Output()
}
