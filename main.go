package main

import (
	"context"
	"embed"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"localjson/app/consts"
	"localjson/app/services"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

const appName = "LocalJson"
const version = "0.0.1"

var icon []byte

func main() {
	fileService := services.FileService()
	prefSvc := services.Preferences()
	prefSvc.SetAppVersion(version)
	windowWidth, windowHeight, maximised := prefSvc.GetWindowSize()
	windowStartState := options.Normal
	if maximised {
		windowStartState = options.Maximised
	}

	// menu
	isMacOS := runtime.GOOS == "darwin"
	appMenu := menu.NewMenu()
	if isMacOS {
		appMenu.Append(menu.AppMenu())
		appMenu.Append(menu.EditMenu())
		appMenu.Append(menu.WindowMenu())
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:                    appName,
		Width:                    windowWidth,
		Height:                   windowHeight,
		MinWidth:                 consts.MinWindowWidth,
		MinHeight:                consts.MinWindowHeight,
		WindowStartState:         windowStartState,
		Frameless:                !isMacOS,
		Menu:                     appMenu,
		EnableDefaultContextMenu: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			fileService.Startup(ctx)
		},
		Bind: []interface{}{
			prefSvc,
			fileService,
		},
		Mac: &mac.Options{
			//TitleBar: mac.TitleBarHiddenInset(),
			About: &mac.AboutInfo{
				Title:   fmt.Sprintf("%s %s", appName, version),
				Message: "A modern lightweight cross-platform devTools desktop client.\n\nCopyright © 2024",
				Icon:    icon,
			},
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
		},
		Windows: &windows.Options{
			WebviewIsTransparent:              false,
			WindowIsTranslucent:               false,
			DisableFramelessWindowDecorations: false,
		},
		Linux: &linux.Options{
			ProgramName:         appName,
			Icon:                icon,
			WebviewGpuPolicy:    linux.WebviewGpuPolicyOnDemand,
			WindowIsTranslucent: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
